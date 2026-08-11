import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../modules/cart/types";

type CartState = {
  items: CartItem[];
};

// The database is the source of truth for cart contents (see cartService.ts).
// No localStorage here - state only ever gets set from a server response, so
// it can't be forged by editing client storage.
const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Replaces the whole cart with the server's response after every mutation.
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
