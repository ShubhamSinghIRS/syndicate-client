import { RequestServer } from "../../utils/services";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { getStorageItem, setStorageItem } from "../../utils/storageUtils";
import type { CartItem } from "./types";

const GUEST_CART_ID_KEY = "guestCartId";

// Random id for a guest's cart, generated once and reused from storage.
export const getOrCreateGuestCartId = (): string => {
  const existing = getStorageItem<string>(GUEST_CART_ID_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  setStorageItem(GUEST_CART_ID_KEY, id);
  return id;
};

export const fetchCart = async (): Promise<CartItem[] | null> => {
  const guestCartId = getOrCreateGuestCartId();
  const { items } = await RequestServer<{ items: CartItem[] }>(
    `${API_ENDPOINTS.cart}?guestCartId=${guestCartId}`,
    "GET",
  );
  return items;
};

export const syncAddCartItem = async (item: CartItem): Promise<void> => {
  const guestCartId = getOrCreateGuestCartId();
  await RequestServer(`${API_ENDPOINTS.cart}/items`, "POST", {
    guestCartId,
    transcriptId: item.id,
  });
};

export const syncRemoveCartItem = async (id: string): Promise<void> => {
  const guestCartId = getOrCreateGuestCartId();
  await RequestServer(
    `${API_ENDPOINTS.cart}/items/${id}?guestCartId=${guestCartId}`,
    "DELETE",
  );
};

export const syncClearCart = async (): Promise<void> => {
  const guestCartId = getOrCreateGuestCartId();
  await RequestServer(`${API_ENDPOINTS.cart}?guestCartId=${guestCartId}`, "DELETE");
};

// Folds the guest cart into the account cart after sign-in/sign-up.
export const mergeGuestCartIntoAccount = async (
  guestItems: CartItem[],
): Promise<CartItem[]> => {
  const guestCartId = getOrCreateGuestCartId();
  const { items } = await RequestServer<{ items: CartItem[] }>(
    `${API_ENDPOINTS.cart}/merge`,
    "POST",
    { guestCartId, items: guestItems.map((item) => item.id) },
  );
  return items;
};
