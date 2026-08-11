import { getStorageItem } from "./storageUtils";
import { logout, processToken } from "./authUtils";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV
    ? "http://localhost:8000"
    : "https://syndicate-transcript-backend.onrender.com");

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

// Access tokens are short-lived; the backend hands out a long-lived refresh
// token via an httpOnly cookie (scoped to /api/auth) instead. `credentials:
// "include"` on every request is what lets the browser store/send that
// cookie across the cross-origin frontend/backend split. Deduped so several
// requests 401ing at once trigger a single refresh instead of racing each
// other to rotate the refresh token.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}${API_ENDPOINTS.refresh}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const json = await response.json();
        const data = json?.data as
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
  const request = (token: string | null) =>
    fetch(`${API_BASE_URL}${url}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  const token = getStorageItem<string>("token");
  let response = await request(token);

  if (response.status === 401 && token) {
    // Access token may have simply expired - try a silent refresh before
    // logging the user out.
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await request(refreshedToken);
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
    throw new ApiError("Not authenticated", 401);
  }

  const json = await response.json();

  if (!response.ok) {
    throw new ApiError(json?.message || `Request failed: ${response.status}`, response.status, json?.data);
  }

  return (json as ApiEnvelope<T>).data;
};

export const RequestServerBlob = async (
  url: string,
  errorMessage: string,
): Promise<Blob> => {
  const request = (token: string | null) =>
    fetch(`${API_BASE_URL}${url}`, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

  const token = getStorageItem<string>("token");
  let response = await request(token);

  if (response.status === 401 && token) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await request(refreshedToken);
    }
  }

  if (response.status === 401) {
    if (token) {
      logout();
      throw new Error("Session expired");
    }
    throw new Error(`${errorMessage}: 401`);
  }

  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }

  return response.blob();
};
