import { clearStorage, setStorageItem } from "./storageUtils";
import { APP_ROUTES } from "../constants/appRoutes";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { RequestServer } from "./services";

// Login/signup happen inside a dialog without a page reload, so hooks that
// already mounted (and cached e.g. isLoggedIn() from before sign-in) need a
// signal to refetch - this is that signal.
export const AUTH_CHANGED_EVENT = "auth-changed";

// In-memory cache of the server's answer to "am I logged in?" (see
// RootLayout's GET /api/users/me on load) - the JWT cookie itself is httpOnly.
let loggedIn = false;

export const setLoggedIn = (value: boolean): void => {
  loggedIn = value;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const isLoggedIn = (): boolean => loggedIn;

export const processToken = (user?: {
  id?: string;
  name?: string;
  email?: string;
  companyName?: string | null;
}): void => {
  if (user?.id) setStorageItem("userId", user.id);
  if (user?.name) setStorageItem("userName", user.name);
  if (user?.email) setStorageItem("email", user.email);
  if (user?.companyName) setStorageItem("companyName", user.companyName);

  setLoggedIn(true);
};

export const logout = (): void => {
  void RequestServer(API_ENDPOINTS.logout, "POST").finally(() => {
    clearStorage();
    setLoggedIn(false);
    window.location.href = APP_ROUTES.home;
  });
};
