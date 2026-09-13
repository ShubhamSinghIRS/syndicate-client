import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import { addCartItemLocal, removeCartItem, setCartItems, setCartLoaded } from "../../../redux/cartSlice";
import {
  fetchCart,
  mergeGuestCartIntoAccount,
  syncAddCartItem,
  syncClearCart,
  syncRemoveCartItem,
} from "../cartService";
import type { CartItem } from "../types";

// Cart state always mirrors the last server response (see cartService.ts).
export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const isLoaded = useSelector((state: RootState) => state.cart.isLoaded);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const { enqueueSnackbar } = useSnackbar();

  return {
    items,
    total,
    isLoaded,
    // Optimistic: update locally first, sync in background, roll back on failure.
    addToCart: async (item: CartItem) => {
      dispatch(addCartItemLocal(item));
      try {
        await syncAddCartItem(item);
      } catch (err) {
        console.error("Failed to sync add-to-cart:", err);
        dispatch(removeCartItem(item.id));
        enqueueSnackbar("Couldn't add item to your cart. Please try again.", {
          variant: "error",
        });
      }
    },
    removeFromCart: async (id: string) => {
      const removedItem = items.find((item) => item.id === id);
      dispatch(removeCartItem(id));
      try {
        await syncRemoveCartItem(id);
      } catch (err) {
        console.error("Failed to sync remove-from-cart:", err);
        if (removedItem) dispatch(addCartItemLocal(removedItem));
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
      } finally {
        dispatch(setCartLoaded());
      }
    },
  };
};
