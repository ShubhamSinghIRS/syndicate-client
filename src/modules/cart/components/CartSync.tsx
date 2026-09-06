import { useEffect } from "react";
import { useCart } from "../hooks/useCart";

// Hydrates the cart from the server on load (account cart, or guest via cookie).
export default function CartSync() {
  const { loadCart } = useCart();

  useEffect(() => {
    loadCart().catch((err) => console.error("Failed to load cart:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
