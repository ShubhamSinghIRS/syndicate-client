import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { setCartItems } from "../../../redux/cartSlice";
import {
  fetchCart,
  mergeGuestCartIntoAccount,
  syncAddCartItem,
  syncClearCart,
  syncRemoveCartItem,
} from "../cartService";
import type { CartItem } from "../types";

// Cart state always mirrors the last server response (see cartService.ts) -
// the database is the source of truth, never client storage, so the cart
// can't be forged by editing local state.
export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const { enqueueSnackbar } = useSnackbar();

  return {
    items,
    total,
    addToCart: async (item: CartItem) => {
      try {
        const updated = await syncAddCartItem(item);
        dispatch(setCartItems(updated));
      } catch (err) {
        console.error("Failed to sync add-to-cart:", err);
        enqueueSnackbar("Couldn't add item to your cart. Please try again.", {
          variant: "error",
        });
      }
    },
    removeFromCart: async (id: string) => {
      try {
        const updated = await syncRemoveCartItem(id);
        dispatch(setCartItems(updated));
      } catch (err) {
        console.error("Failed to sync remove-from-cart:", err);
        enqueueSnackbar("Couldn't remove item from your cart. Please try again.", {
          variant: "error",
        });
      }
    },
    clearCart: async () => {
      try {
        const updated = await syncClearCart();
        dispatch(setCartItems(updated));
      } catch (err) {
        console.error("Failed to sync clear-cart:", err);
        enqueueSnackbar("Couldn't clear your cart. Please try again.", {
          variant: "error",
        });
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
