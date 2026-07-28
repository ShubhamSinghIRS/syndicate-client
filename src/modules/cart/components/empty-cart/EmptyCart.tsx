import { Link } from "react-router-dom";
import Button from "../../../../components/button/Button";
import ShoppingCartIcon from "../../../../icons/ShoppingCart/ShoppingCart";
import { APP_ROUTES } from "../../../../constants/appRoutes";

export default function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-10 text-center">
      <ShoppingCartIcon sx={{ fontSize: 48 }} className="text-text-secondary" />
      <h1 className="text-xl font-bold text-text-primary">
        Your cart is empty
      </h1>
      <p className="text-sm text-text-secondary">
        Browse our library of verified expert transcripts and add a few to get
        started.
      </p>
      <div className="mt-3">
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
