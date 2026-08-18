import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { consumeAuthTokenFromUrl } from "../utils/authUtils";
import FloatingSupport from "../components/support/FloatingSupport";
import { AuthDialogProvider } from "../modules/auth/context/AuthDialogContext";

export default function RootLayout() {
  const location = useLocation();
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  useEffect(() => {
    consumeAuthTokenFromUrl();
    setAuthCheckCompleted(true);
  }, [location.pathname, location.search]);

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

  if (!authCheckCompleted) {
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
