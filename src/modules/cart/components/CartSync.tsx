import { useEffect } from "react";
import { useCart } from "../hooks/useCart";

// Hydrates the cart from the server on load - for a signed-in user via their
// account cart, for a guest via their guest_id cookie. The database is the
// only source of truth for cart contents, so this always runs.
export default function CartSync() {
  const { loadCart } = useCart();

  useEffect(() => {
    loadCart().catch((err) => console.error("Failed to load cart:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
