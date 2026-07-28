import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  addToCart,
  clearCart,
  removeFromCart,
  setCartItems,
} from "../../../redux/cartSlice";
import {
  fetchCart,
  mergeGuestCartIntoAccount,
  syncAddCartItem,
  syncClearCart,
  syncRemoveCartItem,
} from "../cartService";
import type { CartItem } from "../types";

// Cart is persisted to localStorage (see cartSlice.ts) and synced to the
// server via cartService.ts.
export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    items,
    total,
    addToCart: async (item: CartItem) => {
      dispatch(addToCart(item));
      try {
        await syncAddCartItem(item);
      } catch (err) {
        console.error("Failed to sync add-to-cart:", err);
      }
    },
    removeFromCart: async (id: string) => {
      dispatch(removeFromCart(id));
      try {
        await syncRemoveCartItem(id);
      } catch (err) {
        console.error("Failed to sync remove-from-cart:", err);
      }
    },
    clearCart: async () => {
      dispatch(clearCart());
      try {
        await syncClearCart();
      } catch (err) {
        console.error("Failed to sync clear-cart:", err);
      }
    },
    // Folds the guest cart into the account cart; call right after sign-in/sign-up.
    mergeGuestCartAfterAuth: async () => {
      try {
        const merged = await mergeGuestCartIntoAccount(items);
        dispatch(setCartItems(merged));
      } catch (err) {
        console.error("Failed to merge guest cart:", err);
      }
    },
    // Hydrates the cart from the server on app load.
    loadCart: async () => {
      try {
        const serverItems = await fetchCart();
        if (serverItems) dispatch(setCartItems(serverItems));
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    },
  };
};
