import { useEffect, useState } from "react";
import { clearStorage, hasStorageItem, setStorageItem } from "./storageUtils";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { RequestServer, clearScheduledTokenRefresh } from "./services";

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

// Reactive version of isLoggedIn() - a plain function call in a component's
// render body reads the value fresh each render, but nothing makes React
// re-render that component when the value changes elsewhere (e.g. logout
// firing while the component is just sitting there, not re-rendering for
// any other reason). This subscribes to AUTH_CHANGED_EVENT so the header,
// route guards, etc. update the instant login state actually changes,
// instead of only reflecting it after some unrelated re-render or a full
// page reload happens to occur.
export const useIsLoggedIn = (): boolean => {
  const [value, setValue] = useState(loggedIn);
  useEffect(() => {
    const handleChange = () => setValue(loggedIn);
    window.addEventListener(AUTH_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, handleChange);
  }, []);
  return value;
};

// Cheap, non-sensitive hint (plain localStorage, not the httpOnly auth
// cookie) for "was this browser previously logged in" - most real sites
// keep something like this alongside the real session cookie, so they can
// skip a guaranteed-to-fail "who am I" round trip for a visitor who has
// never logged in or has already logged out, rather than firing it (and the
// refresh-retry behind it) on every single page load regardless.
export const hasStoredSession = (): boolean => hasStorageItem("userId");

export const persistUserSession = (user?: {
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
  // Local state clears immediately and nothing here forces a page reload or
  // navigation - Amazon/Flipkart-style sign-out. A logged-in-only page
  // (checkout, profile - see RequireAuth) reactively notices via
  // useIsLoggedIn and soft-redirects itself; every other page just updates
  // its header in place and stays exactly where the user was. Navigating
  // unconditionally to home on every logout, regardless of where the user
  // was, is the wrong default - most of the time there's no reason to leave
  // the page at all.
  clearStorage();
  setLoggedIn(false);
  clearScheduledTokenRefresh();
  // Best-effort - the client is already signed out locally either way; if
  // this fails, the session row just outlives its normal revoke path until
  // it naturally expires.
  void RequestServer(API_ENDPOINTS.logout, "POST").catch(() => {});
};
