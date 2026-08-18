import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer, RequestServerBlob } from "../../utils/services";
import {
  fetchAllPurchasedTranscripts,
  fetchTranscriptById,
} from "../transcripts/transcriptsService";
import type { Transcript } from "../transcripts/types";
import type {
  CreateRazorpayOrderPayload,
  CreateRazorpayOrderResponse,
  Order,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "./types";

type BackendOrderSummary = {
  id: string;
  transcripts?: string[];
  amount: number;
  status: "created" | "paid" | "failed";
  createdAt: string;
};

// Builds an order's items from an already-fetched purchased-transcripts
// lookup, rather than fetching each transcript individually - both faster
// (no N calls per order) and more correct: myPurchased already excludes
// items whose access was later revoked (e.g. a refund), which the order's
// own "paid" status alone wouldn't catch.
const buildOrderFromPurchased = (
  order: BackendOrderSummary,
  purchasedById: Map<string, Transcript>,
): Order => ({
  id: order.id,
  items: (order.transcripts ?? [])
    .map((id) => purchasedById.get(id))
    .filter((item): item is Transcript => item !== undefined),
  total: order.amount,
  createdAt: order.createdAt,
});

export const fetchOrders = async (): Promise<Order[]> => {
  const [backendOrders, purchasedTranscripts] = await Promise.all([
    RequestServer<BackendOrderSummary[]>(API_ENDPOINTS.orders, "GET"),
    fetchAllPurchasedTranscripts(),
  ]);
  const purchasedById = new Map(
    purchasedTranscripts.map((item) => [item.id, item] as const),
  );

  return backendOrders
    .filter((order) => order.status === "paid")
    .map((order) => buildOrderFromPurchased(order, purchasedById))
    .filter((order) => order.items.length > 0);
};

// Authoritative order record straight from the backend - called right after
// a payment verifies, so the confirmation screen shows what was actually
// recorded (amount, items) instead of whatever the client had in state.
// Hydrates directly from the order's own transcript ids (not the purchased
// list above) since this fires the instant a payment completes and there's
// no batch of historic orders to cross-reference against - a bad/deleted id
// shouldn't hide the rest of the order.
export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const backendOrder = await RequestServer<BackendOrderSummary>(
    API_ENDPOINTS.orderDetail.replace(":id", orderId),
    "GET",
  );
  const itemResults = await Promise.allSettled(
    (backendOrder.transcripts ?? []).map((id) => fetchTranscriptById(id)),
  );
  const items = itemResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  return {
    id: backendOrder.id,
    items,
    total: backendOrder.amount,
    createdAt: backendOrder.createdAt,
  };
};

// idempotencyKey should be generated once per checkout attempt (see
// Checkout.tsx) so a double-click or retried request reuses the same order
// instead of creating a duplicate.
export const createRazorpayOrder = async (
  payload: CreateRazorpayOrderPayload,
  idempotencyKey: string,
): Promise<CreateRazorpayOrderResponse> =>
  RequestServer(API_ENDPOINTS.orders, "POST", payload, { "Idempotency-Key": idempotencyKey });

export const verifyRazorpayPayment = async (
  payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResponse> =>
  RequestServer(API_ENDPOINTS.orderVerify, "POST", payload);

export const viewOrderReceipt = async (orderId: string): Promise<void> => {
  // Open the tab synchronously (still inside the click's user-gesture
  // window) and point it at the blob once it's fetched - opening a new
  // tab only after the awaited fetch resolves gets silently blocked by
  // popup blockers since it's no longer tied to the user gesture.
  const receiptWindow = window.open("", "_blank");
  const blob = await RequestServerBlob(
    API_ENDPOINTS.orderReceipt.replace(":id", orderId),
    "Failed to load receipt",
  );
  const url = URL.createObjectURL(blob);
  if (receiptWindow) {
    receiptWindow.location.href = url;
  } else {
    window.open(url, "_blank");
  }
};
