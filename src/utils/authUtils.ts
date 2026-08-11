import { clearStorage, getStorageItem, setStorageItem } from "./storageUtils";
import { APP_ROUTES } from "../constants/appRoutes";

type JWTPayload = {
  user_id: string;
  user_name: string;
  email: string;
  [key: string]: unknown;
};

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Login/signup happen inside a dialog without a page reload, so hooks that
// already mounted (and cached e.g. isLoggedIn() from before sign-in) need a
// signal to refetch - this is that signal.
export const AUTH_CHANGED_EVENT = "auth-changed";

export const processToken = (
  token: string,
  user?: {
    id?: string;
    name?: string;
    email?: string;
    companyName?: string | null;
  },
): void => {
  setStorageItem("token", token);
  setStorageItem("authToken", token);

  // `user` from the login/register response takes priority; JWT claims are
  // the fallback for the SSO handoff below.
  const payload = decodeJWT(token);
  const userId = user?.id ?? payload?.user_id;
  const userName = user?.name ?? payload?.user_name;
  const email = user?.email ?? payload?.email;

  if (userId) setStorageItem("userId", userId);
  if (userName) setStorageItem("userName", userName);
  if (email) setStorageItem("email", email);
  if (user?.companyName) setStorageItem("companyName", user.companyName);

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const isLoggedIn = (): boolean => {
  return !!getStorageItem<string>("token");
};

// TODO: uncomment once /api/auth/logout exists (fire-and-forget).
// import { API_ENDPOINTS } from "../constants/apiEndpoints";
// import { RequestServer } from "./services";
export const logout = (): void => {
  // void RequestServer(API_ENDPOINTS.logout, "POST");
  clearStorage();
  window.location.href = APP_ROUTES.home;
};

// Handles SSO handoff from the main Infollion site via ?auth_token=.
export const consumeAuthTokenFromUrl = (): void => {
  const params = new URLSearchParams(window.location.search);
  const authToken = params.get("auth_token");
  if (!authToken) return;

  processToken(authToken);

  params.delete("auth_token");
  const newSearch = params.toString();
  const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", newUrl);
};
