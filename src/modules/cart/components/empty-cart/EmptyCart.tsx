import { Link } from "react-router-dom";
import Button from "../../../../components/button/Button";
import ShoppingCartIcon from "../../../../icons/ShoppingCart/ShoppingCart";
import { APP_ROUTES } from "../../../../constants/appRoutes";

export default function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-14 text-center">
      <ShoppingCartIcon sx={{ fontSize: 96 }} className="text-text-secondary" />
      <h1 className="text-2xl font-bold text-text-primary">
        Your cart is empty
      </h1>
      <p className="text-base text-text-secondary">
       Browse expert transcripts and add your selections to the cart.
      </p>
      <div className="mt-4">
        <Link to={APP_ROUTES.transcripts}>
          <Button
            variant="contained"
            label="Browse Transcripts"
          />
        </Link>
      </div>
    </div>
  );
}
