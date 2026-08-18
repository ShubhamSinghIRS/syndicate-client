import { useNavigate } from "react-router-dom";
import { setBuyNowItem } from "../buyNowStorage";
import { useAuthDialog } from "../../auth/context/AuthDialogContext";
import { isLoggedIn } from "../../../utils/authUtils";
import { APP_ROUTES } from "../../../constants/appRoutes";
import type { Transcript } from "../../transcripts/types";

// Shared by every "Buy Transcript"/"Buy Now" entry point (transcript card,
// transcript detail) - bypasses the cart entirely via sessionStorage.
export function useBuyNow() {
  const navigate = useNavigate();
  const { openAuthDialog } = useAuthDialog();

  return (transcript: Transcript) => {
    const goToBuyNowCheckout = () => {
      // Bypasses the cart; sessionStorage survives navigation.
      setBuyNowItem(transcript);
      navigate(APP_ROUTES.checkout);
    };

    if (isLoggedIn()) {
      goToBuyNowCheckout();
      return;
    }

    // Sign in here, then continue straight to checkout.
    openAuthDialog("signin", goToBuyNowCheckout);
  };
}
