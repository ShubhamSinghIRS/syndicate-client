import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../modules/home/Home";
import TranscriptsList from "../modules/transcripts/pages/TranscriptsList";
import TranscriptDetail from "../modules/transcripts/pages/TranscriptDetail";
import Cart from "../modules/cart/Cart";
import Checkout from "../modules/checkout/Checkout";
import Profile from "../modules/profile/Profile";
import ResetPassword from "../modules/auth/pages/ResetPassword";
import RequireAuth from "../components/require-auth/RequireAuth";
import ErrorPage from "../modules/error-page/ErrorPage";
import { APP_ROUTES } from "../constants/appRoutes";

const router = createBrowserRouter([
  {
    path: APP_ROUTES.home,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: APP_ROUTES.transcripts, element: <TranscriptsList /> },
      { path: APP_ROUTES.transcriptDetail, element: <TranscriptDetail /> },
      { path: APP_ROUTES.cart, element: <Cart /> },
      { path: APP_ROUTES.resetPassword, element: <ResetPassword /> },
      {
        path: APP_ROUTES.checkout,
        element: (
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        ),
      },
      {
        path: APP_ROUTES.profile,
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
    ],
  },
]);

export default router;
