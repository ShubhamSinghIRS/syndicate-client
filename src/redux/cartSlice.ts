import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../modules/cart/types";

type CartState = {
  items: CartItem[];
  isLoaded: boolean;
};

// The database is the source of truth for cart contents (see cartService.ts).
// No localStorage here - state only ever gets set from a server response, so
// it can't be forged by editing client storage.
const initialState: CartState = {
  items: [],
  isLoaded: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Replaces the whole cart with the server's response after every mutation.
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    // Removing a single item is a local update, not a re-sync - the caller
    // already knows the id it just deleted server-side, so there's no need
    // to round-trip the whole remaining cart to stay in sync.
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // Optimistic local insert, used before the add-to-cart request resolves
    // (see useCart.ts) so the UI reacts instantly instead of waiting on a
    // round trip - guarded against duplicates in case of a fast double-click.
    addCartItemLocal: (state, action: PayloadAction<CartItem>) => {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    // Flips once after the initial hydration from the server settles (success
    // or failure), so the UI can tell "still loading" apart from "empty".
    setCartLoaded: (state) => {
      state.isLoaded = true;
    },
  },
});

export const { setCartItems, setCartLoaded, removeCartItem, addCartItemLocal } = cartSlice.actions;
export default cartSlice.reducer;
