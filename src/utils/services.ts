import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { isLoggedIn, logout, persistUserSession } from "./authUtils";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

// TODO: add a separate branch here once a dev/staging domain exists.
const getApiBaseUrl = (): string => {
  if (window.location.href.includes("localhost")) {
    return "http://localhost:8000";
  }
  return "https://syndicate-transcript-backend-ac3k.onrender.com";
};

const API_BASE_URL = getApiBaseUrl();

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

// axios doesn't time out on its own - a hung backend would leave callers awaiting forever.
const REQUEST_TIMEOUT_MS = 20000;

// validateStatus lets 4xx/5xx through so status handling stays manual below, in one place.
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
  validateStatus: () => true,
});

const isTimeout = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT");

// No response at all (backend down, DNS/CORS failure, offline) as opposed to
// a response that simply carries an error status.
const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;

const request = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    return await client.request(config);
  } catch (error) {
    if (isTimeout(error) || isNetworkError(error)) {
      window.enqueueSnackbar?.("Server connection failed", { variant: "error" });
    }
    if (isTimeout(error)) {
      throw new Error("The request timed out. Please check your connection and try again.");
    }
    throw error;
  }
};

// Tokens live in httpOnly cookies, sent automatically via withCredentials.
// Deduped so several requests 401ing at once share one refresh.
let refreshPromise: Promise<boolean> | null = null;

// Proactive refresh: scheduled a bit before the access token's real expiry
// (reported by the backend - the token itself is httpOnly, so the frontend
// can't read its `exp` claim directly) so most requests never see a 401 in
// the first place. RequestServer's reactive 401-then-refresh-then-retry
// stays as the safety net for whatever this timer misses (clock drift, the
// laptop sleeping through it, a tab that was backgrounded, etc.).
const REFRESH_BUFFER_SECONDS = 60;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

export const scheduleTokenRefresh = (expiresInSeconds: number): void => {
  if (refreshTimer) clearTimeout(refreshTimer);
  const delaySeconds = Math.max(expiresInSeconds - REFRESH_BUFFER_SECONDS, 5);
  refreshTimer = setTimeout(() => {
    void refreshAccessToken();
  }, delaySeconds * 1000);
};

export const clearScheduledTokenRefresh = (): void => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

export const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = request({
      url: API_ENDPOINTS.refresh,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) return false;
        const data = response.data?.data as
          | { user?: Parameters<typeof persistUserSession>[0]; accessTokenExpiresIn?: number }
          | undefined;
        persistUserSession(data?.user);
        // Re-schedule off the new token's own lifetime rather than assuming
        // it matches the one that just expired.
        if (data?.accessTokenExpiresIn) scheduleTokenRefresh(data.accessTokenExpiresIn);
        return true;
      })
      .catch(() => false)
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
  const send = () =>
    request({
      url,
      method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders,
      },
    });

  const wasLoggedIn = isLoggedIn();
  let response = await send();

  // Retried on ANY 401, not just when the client already believed it was
  // logged in. isLoggedIn() is only set after RootLayout's own session check
  // resolves - on a fresh page load, calls that fire before that (cart, me)
  // would otherwise skip this retry precisely when they need it most, since
  // wasLoggedIn is still false at that point even for a genuinely logged-in
  // user whose access token just expired. refreshAccessToken is deduped and
  // fails fast with no refresh cookie, so this is harmless for a truly
  // anonymous caller too.
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await send();
    }
  }

  if (response.status === 401) {
    if (wasLoggedIn) {
      logout();
      throw new Error("Session expired");
    }
    // Anonymous 401s aren't always "please log in" - login/OTP endpoints
    // also use 401 for wrong credentials, with their own message.
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
  const send = () =>
    request({
      url,
      method: "GET",
      responseType: "blob",
    });

  const wasLoggedIn = isLoggedIn();
  let response = await send();

  // See the identical comment in RequestServer - retried on any 401, not
  // gated on wasLoggedIn, which is unreliable this early in the page's life.
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await send();
    }
  }

  if (response.status === 401) {
    if (wasLoggedIn) {
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
