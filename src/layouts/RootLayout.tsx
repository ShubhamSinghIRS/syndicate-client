import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingSupport from "../components/support/FloatingSupport";
import { AuthDialogProvider } from "../modules/auth/context/AuthDialogContext";
import { processToken, setLoggedIn } from "../utils/authUtils";
import { fetchProfile } from "../modules/profile/profileService";
import { refreshAccessToken } from "../utils/services";

export default function RootLayout() {
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  // Ask the server who we are on load; retry once via refresh before giving up.
  useEffect(() => {
    let cancelled = false;
    const restoreSession = async () => {
      try {
        const profile = await fetchProfile();
        if (!cancelled) processToken(profile);
      } catch {
        // refreshAccessToken is deduped across concurrent callers (see
        // services.ts) so StrictMode's double-mount in dev doesn't fire two
        // separate refresh requests here.
        const refreshed = await refreshAccessToken();
        if (!cancelled && !refreshed) setLoggedIn(false);
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
