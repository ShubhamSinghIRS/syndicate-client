import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { getStorageItem } from "./storageUtils";
import { logout, processToken } from "./authUtils";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://syndicate-transcript-backend-ac3k.onrender.com");

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// axios never times out on its own unless told to - a hung backend (cold
// start, dropped connection, mid-deploy) would otherwise leave a caller's
// await pending forever with no error and no way to recover.
const REQUEST_TIMEOUT_MS = 20000;

// Status codes are inspected manually below (401-then-refresh-then-retry,
// envelope unwrapping) instead of letting axios throw on 4xx/5xx, so every
// non-network failure stays handled in one place.
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
  validateStatus: () => true,
});

const isTimeout = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT");

const request = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    return await client.request(config);
  } catch (error) {
    if (isTimeout(error)) {
      throw new Error("The request timed out. Please check your connection and try again.");
    }
    throw error;
  }
};

// Access tokens are short-lived; the backend hands out a long-lived refresh
// token via an httpOnly cookie (scoped to /api/auth) instead. `withCredentials`
// on every request is what lets the browser store/send that cookie across
// the cross-origin frontend/backend split. Deduped so several requests
// 401ing at once trigger a single refresh instead of racing each other to
// rotate the refresh token.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = request({
      url: API_ENDPOINTS.refresh,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) return null;
        const data = response.data?.data as
          | { token?: string; user?: Parameters<typeof processToken>[1] }
          | undefined;
        if (!data?.token) return null;
        processToken(data.token, data.user);
        return data.token;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const RequestServer = async <T>(
  url: string,
  method: RequestMethod,
  body?: object,
  extraHeaders?: Record<string, string>,
): Promise<T> => {
  const send = (token: string | null) =>
    request({
      url,
      method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
      },
    });

  const token = getStorageItem<string>("token");
  let response = await send(token);

  if (response.status === 401 && token) {
    // Access token may have simply expired - try a silent refresh before
    // logging the user out.
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await send(refreshedToken);
    }
  }

  if (response.status === 401) {
    // Only a real session teardown if we were actually logged in - a
    // request made with no token (anonymous browsing hitting a protected
    // or misconfigured endpoint) shouldn't wipe storage or hard-redirect.
    if (token) {
      logout();
      throw new Error("Session expired");
    }
    // A 401 with no token isn't always "you need to log in" - e.g. the
    // login/OTP endpoints themselves use 401 for wrong credentials, and
    // have a specific message worth showing instead of a generic one.
    throw new ApiError(response.data?.message || "Not authenticated", 401);
  }

  if (response.status < 200 || response.status >= 300) {
    throw new ApiError(
      response.data?.message || `Request failed: ${response.status}`,
      response.status,
      response.data?.data,
    );
  }

  return (response.data as ApiEnvelope<T>).data;
};

export const RequestServerBlob = async (
  url: string,
  errorMessage: string,
): Promise<Blob> => {
  const send = (token: string | null) =>
    request({
      url,
      method: "GET",
      responseType: "blob",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

  const token = getStorageItem<string>("token");
  let response = await send(token);

  if (response.status === 401 && token) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await send(refreshedToken);
    }
  }

  if (response.status === 401) {
    if (token) {
      logout();
      throw new Error("Session expired");
    }
    throw new Error(`${errorMessage}: 401`);
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }

  return response.data as Blob;
};
