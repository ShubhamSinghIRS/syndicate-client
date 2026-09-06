import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingSupport from "../components/support/FloatingSupport";
import { AuthDialogProvider } from "../modules/auth/context/AuthDialogContext";
import { hasStoredSession, persistUserSession, setLoggedIn } from "../utils/authUtils";
import { fetchProfile } from "../modules/profile/profileService";
import { scheduleTokenRefresh } from "../utils/services";

export default function RootLayout() {
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  // Restore session on load. fetchProfile already retries once internally
  // after a refresh attempt on a 401 (see RequestServer in services.ts), so
  // reaching the catch here means the session is genuinely gone - no need
  // to try refreshing a second time.
  useEffect(() => {
    let cancelled = false;
    const restoreSession = async () => {
      // No point calling the server at all if this browser has never logged
      // in (or already logged out) - hasStoredSession is a cheap local hint
      // that skips a guaranteed-to-fail /me (and the refresh attempt behind
      // it) for the common case of a genuinely anonymous visitor.
      if (!hasStoredSession()) {
        if (!cancelled) setAuthChecked(true);
        return;
      }
      try {
        const profile = await fetchProfile();
        if (!cancelled) {
          persistUserSession(profile);
          scheduleTokenRefresh(profile.accessTokenExpiresIn);
        }
      } catch {
        if (!cancelled) setLoggedIn(false);
      } finally {
        if (!cancelled) setAuthChecked(true);
      }
    };
    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  if (!authChecked) {
    return null;
  }

  return (
    <AuthDialogProvider>
      <div className="bg-layout-background relative">
        <Outlet />
        <FloatingSupport />
      </div>
    </AuthDialogProvider>
  );
}
