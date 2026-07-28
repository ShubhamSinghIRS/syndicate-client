import { getStorageItem } from "./storageUtils";
import { logout } from "./authUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://syndicate-transcript-backend.onrender.com");

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const RequestServer = async <T>(
  url: string,
  method: RequestMethod,
  body?: object,
): Promise<T> => {
  const token = getStorageItem<string>("token");

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    logout();
    throw new Error("Session expired");
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || `Request failed: ${response.status}`);
  }

  return (json as ApiEnvelope<T>).data;
};

export const RequestServerBlob = async (
  url: string,
  errorMessage: string,
): Promise<Blob> => {
  const token = getStorageItem<string>("token");

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (response.status === 401) {
    logout();
    throw new Error("Session expired");
  }

  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status}`);
  }

  return response.blob();
};
