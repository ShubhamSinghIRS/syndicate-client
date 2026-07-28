import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getStorageItem, setStorageItem } from "../utils/storageUtils";
import type { CartItem } from "../modules/cart/types";

const CART_STORAGE_KEY = "cart";

type CartState = {
  items: CartItem[];
};

// Hydrate from localStorage so cart items survive refreshes.
const initialState: CartState = {
  items: getStorageItem<CartItem[]>(CART_STORAGE_KEY) ?? [],
};

const persist = (items: CartItem[]) => {
  setStorageItem(CART_STORAGE_KEY, items);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
      persist(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
    // Replaces the whole cart, used after a server round trip (load/merge).
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      persist(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;
