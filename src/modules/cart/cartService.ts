import { RequestServer } from "../../utils/services";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { mapTranscript, type RawTranscript } from "../transcripts/transcriptsService";
import type { CartItem } from "./types";

// The backend issues the guest cart id itself (set via cookie, sent with
// credentials: "include"), so requests don't need to carry one.
export const fetchCart = async (): Promise<CartItem[] | null> => {
  const { items } = await RequestServer<{ items: RawTranscript[] }>(
    API_ENDPOINTS.cart,
    "GET",
  );
  return items.map(mapTranscript);
};

// Each mutation returns the server's authoritative cart so the UI never has
// to guess at state - it just renders whatever the database says.
export const syncAddCartItem = async (item: CartItem): Promise<CartItem[]> => {
  const { items } = await RequestServer<{ items: RawTranscript[] }>(
    `${API_ENDPOINTS.cart}/items`,
    "POST",
    { transcriptId: item.id },
  );
  return items.map(mapTranscript);
};

export const syncRemoveCartItem = async (id: string): Promise<CartItem[]> => {
  const { items } = await RequestServer<{ items: RawTranscript[] }>(
    `${API_ENDPOINTS.cart}/items/${id}`,
    "DELETE",
  );
  return items.map(mapTranscript);
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
