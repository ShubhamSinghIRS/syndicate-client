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
  createdAt: string;
};

// Builds items from the already-fetched purchased lookup - faster, and excludes revoked access.
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
    .map((order) => buildOrderFromPurchased(order, purchasedById))
    .filter((order) => order.items.length > 0);
};

// Authoritative order record fetched right after payment verifies, so confirmation
// shows what was actually recorded rather than client state.
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

// idempotencyKey is generated once per checkout attempt (see Checkout.tsx).
export const createRazorpayOrder = async (
  payload: CreateRazorpayOrderPayload,
  idempotencyKey: string,
): Promise<CreateRazorpayOrderResponse> =>
  RequestServer(API_ENDPOINTS.orders, "POST", payload, { "Idempotency-Key": idempotencyKey });

export const verifyRazorpayPayment = async (
  payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResponse> =>
  RequestServer(API_ENDPOINTS.orderVerify, "POST", payload);

export const downloadOrderReceipt = async (orderId: string): Promise<void> => {
  const blob = await RequestServerBlob(
    API_ENDPOINTS.orderReceipt.replace(":id", orderId),
    "Failed to load receipt",
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `invoice-${orderId}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
};
