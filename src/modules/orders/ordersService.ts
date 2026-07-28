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

// Hydrates each paid order's transcript ids into full items; a bad/deleted
// id shouldn't hide the rest of the order.
export const fetchOrders = async (): Promise<Order[]> => {
  const backendOrders = await RequestServer<BackendOrderSummary[]>(
    API_ENDPOINTS.orders,
    "GET",
  );
  const paidOrders = backendOrders.filter((order) => order.status === "paid");

  const results = await Promise.allSettled(
    paidOrders.map(async (order) => {
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
    }),
  );

  return results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((order) => order.items.length > 0);
};

export const createRazorpayOrder = async (
  payload: CreateRazorpayOrderPayload,
): Promise<CreateRazorpayOrderResponse> =>
  RequestServer(API_ENDPOINTS.orders, "POST", payload);

export const verifyRazorpayPayment = async (
  payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResponse> =>
  RequestServer(API_ENDPOINTS.orderVerify, "POST", payload);

// Purchased-transcript-id check, straight from the backend.
export const fetchPurchasedTranscriptIds = async (): Promise<string[]> => {
  const orders = await RequestServer<BackendOrderSummary[]>(
    API_ENDPOINTS.orders,
    "GET",
  );
  return orders
    .filter((order) => order.status === "paid")
    .flatMap((order) => order.transcripts ?? []);
};

export const viewOrderReceipt = async (orderId: string): Promise<void> => {
  const blob = await RequestServerBlob(
    API_ENDPOINTS.orderReceipt.replace(":id", orderId),
    "Failed to load receipt",
  );
  window.open(URL.createObjectURL(blob), "_blank");
};
