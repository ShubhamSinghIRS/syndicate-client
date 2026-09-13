import { RequestServer } from "../../utils/services";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { mapTranscript, type RawTranscript } from "../transcripts/transcriptsService";
import type { CartItem } from "./types";

// The backend issues the guest cart id via cookie, so requests don't carry one.
export const fetchCart = async (): Promise<CartItem[] | null> => {
  const { items } = await RequestServer<{ items: RawTranscript[] }>(
    API_ENDPOINTS.cart,
    "GET",
  );
  return items.map(mapTranscript);
};

// Backend just confirms success; frontend already updated state optimistically (see useCart.ts).
export const syncAddCartItem = async (item: CartItem): Promise<void> => {
  await RequestServer<null>(`${API_ENDPOINTS.cart}/items`, "POST", {
    transcriptId: item.id,
  });
};

// Backend just confirms success; frontend updates state locally (see cartSlice).
export const syncRemoveCartItem = async (id: string): Promise<void> => {
  await RequestServer<null>(`${API_ENDPOINTS.cart}/items/${id}`, "DELETE");
};

export const syncClearCart = async (): Promise<CartItem[]> => {
  const { items } = await RequestServer<{ items: RawTranscript[] }>(
    API_ENDPOINTS.cart,
    "DELETE",
  );
  return items.map(mapTranscript);
};

// Folds the guest cart into the account cart after sign-in/sign-up.
export const mergeGuestCartIntoAccount = async (
  guestItems: CartItem[],
): Promise<CartItem[]> => {
  const { items } = await RequestServer<{ items: RawTranscript[] }>(
    `${API_ENDPOINTS.cart}/merge`,
    "POST",
    { items: guestItems.map((item) => item.id) },
  );
  return items.map(mapTranscript);
};
