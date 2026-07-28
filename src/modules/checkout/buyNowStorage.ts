import type { CartItem } from "../cart/types";

const BUY_NOW_KEY = "buyNowItem";

// Bypasses the cart; sessionStorage survives the sign-in redirect back to /checkout.
export const setBuyNowItem = (item: CartItem): void => {
  sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
};

export const getBuyNowItem = (): CartItem | null => {
  const raw = sessionStorage.getItem(BUY_NOW_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CartItem;
  } catch {
    return null;
  }
};

export const clearBuyNowItem = (): void => {
  sessionStorage.removeItem(BUY_NOW_KEY);
};
