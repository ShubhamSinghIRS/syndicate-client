import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { isLoggedIn } from "../../../utils/authUtils";

// Hydrates the cart from the server on load for an already-signed-in user.
export default function CartSync() {
  const { loadCart } = useCart();

  useEffect(() => {
    if (isLoggedIn()) {
      loadCart().catch((err) => console.error("Failed to load cart:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
