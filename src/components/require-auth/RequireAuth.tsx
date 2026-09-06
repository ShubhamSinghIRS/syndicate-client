import { Navigate, useLocation } from "react-router-dom";
import { useIsLoggedIn } from "../../utils/authUtils";
import { APP_ROUTES } from "../../constants/appRoutes";
import type { ReactNode } from "react";

type RequireAuthProps = {
  children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  // Reactive - if the user logs out while sitting on a page that needs
  // auth (checkout, profile), this re-renders and redirects them away the
  // instant that happens, rather than only noticing on some later,
  // unrelated re-render (or never, if none happens to occur).
  const loggedIn = useIsLoggedIn();

  if (!loggedIn) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={{
          pathname: APP_ROUTES.home,
          search: `?authRequired=1&redirect_url=${redirectUrl}`,
        }}
        replace
      />
    );
  }

  return <>{children}</>;
}
