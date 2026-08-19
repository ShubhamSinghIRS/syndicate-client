import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "../../../../components/button/Button";
import LockOutlinedIcon from "../../../../icons/LockOutlined/LockOutlined";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import { clearBuyNowItem } from "../../../checkout/buyNowStorage";
import { useAuthDialog } from "../../../auth/context/AuthDialogContext";
import { isLoggedIn } from "../../../../utils/authUtils";

type CartSummaryProps = {
  itemCount: number;
  total: number;
};

export default function CartSummary({ itemCount, total }: CartSummaryProps) {
  const navigate = useNavigate();
  const { openAuthDialog } = useAuthDialog();

  const goToCheckout = () => {
    clearBuyNowItem();
    navigate(APP_ROUTES.checkout);
  };

  const handleCheckoutClick = () => {
    if (isLoggedIn()) {
      goToCheckout();
      return;
    }

    // Sign in here, then continue straight to checkout.
    openAuthDialog("signin", goToCheckout);
  };

  return (
    <div className="sticky top-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-lg font-bold text-text-primary">Summary</h2>

      <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
        <span>
          {itemCount} {itemCount === 1 ? "transcript" : "transcripts"}
        </span>
        <span>${total}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
        <span className="font-semibold text-text-primary">Total</span>
        <span className="text-lg font-bold text-text-primary">
          USD ${total}
        </span>
      </div>

      <div className="mt-5">
        <Button
          variant="contained"
          label="Proceed to Checkout"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          styles={{ width: "100%", height: "42px" }}
          onClick={handleCheckoutClick}
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-text-secondary">
        <LockOutlinedIcon fontSize="inherit" />
        Secure checkout
      </div>
    </div>
  );
}
