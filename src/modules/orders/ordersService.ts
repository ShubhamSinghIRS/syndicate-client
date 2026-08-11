import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer, RequestServerBlob } from "../../utils/services";
import { fetchTranscriptById } from "../transcripts/transcriptsService";
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

// Hydrates a paid order's transcript ids into full items; a bad/deleted
// id shouldn't hide the rest of the order.
const hydrateOrder = async (order: BackendOrderSummary): Promise<Order> => {
  const itemResults = await Promise.allSettled(
    (order.transcripts ?? []).map((id) => fetchTranscriptById(id)),
  );
  const items = itemResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  return {
    id: order.id,
    items,
    total: order.amount,
    createdAt: order.createdAt,
  };
};

export const fetchOrders = async (): Promise<Order[]> => {
  const backendOrders = await RequestServer<BackendOrderSummary[]>(
    API_ENDPOINTS.orders,
    "GET",
  );
  const paidOrders = backendOrders.filter((order) => order.status === "paid");

  const results = await Promise.allSettled(paidOrders.map(hydrateOrder));

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((order) => order.items.length > 0);
};

// Authoritative order record straight from the backend - called right after
// a payment verifies, so the confirmation screen shows what was actually
// recorded (amount, items) instead of whatever the client had in state.
export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const backendOrder = await RequestServer<BackendOrderSummary>(
    API_ENDPOINTS.orderDetail.replace(":id", orderId),
    "GET",
  );
  return hydrateOrder(backendOrder);
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
