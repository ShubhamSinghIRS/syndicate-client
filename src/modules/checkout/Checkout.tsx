import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackButton from "../../components/back-button/BackButton";
import { useCart } from "../cart/hooks/useCart";
import { useOrders } from "../orders/hooks/useOrders";
import { usePurchasedTranscriptIds } from "../orders/hooks/usePurchasedTranscriptIds";
import { createRazorpayOrder, fetchOrderById, verifyRazorpayPayment } from "../orders/ordersService";
import { useCurrentUser } from "../profile/hooks/useCurrentUser";
import { useBoolean } from "../../utils/hooks/useBoolean";
import { ApiError } from "../../utils/services";
import { getBuyNowItem, clearBuyNowItem } from "./buyNowStorage";
import { getCheckoutIdempotencyKey, clearCheckoutIdempotencyKey } from "./checkoutIdempotency";
import OrderDetails from "./components/order-summary/OrderDetails";
import OrderSummary from "./components/order-summary/OrderSummary";
import OrderConfirmation from "./components/order-confirmation/OrderConfirmation";
import PaymentProcessing from "./components/payment-processing/PaymentProcessing";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { APP_ROUTES } from "../../constants/appRoutes";
import type { CartItem } from "../cart/types";
import type { CreateRazorpayOrderResponse, Order, VerifyPaymentPayload } from "../orders/types";

// Payment is already verified by the time this runs - a failed fetchOrderById
// shouldn't block confirmation, so it falls back to what the client already
// knows about the order instead of surfacing an error.
const resolveConfirmedOrder = async (
  orderId: string,
  paymentResponse: VerifyPaymentPayload,
  fallback: Order,
): Promise<Order> => {
  await verifyRazorpayPayment(paymentResponse);

  try {
    return await fetchOrderById(orderId);
  } catch (fetchError) {
    console.error("Failed to fetch confirmed order:", fetchError);
    return fallback;
  }
};

const buildRazorpayOptions = (
  order: CreateRazorpayOrderResponse,
  prefill: { name?: string; email?: string },
  onSuccess: (response: VerifyPaymentPayload) => void,
  onDismiss: () => void,
) => ({
  key: order.keyId,
  amount: Math.round(order.amount * 100),
  currency: order.currency,
  order_id: order.razorpayOrderId,
  name: "Infollion",
  description: "Transcript purchase",
  prefill,
  handler: onSuccess,
  modal: {
    ondismiss: onDismiss,
  },
});

export default function Checkout() {
  // Persisted in sessionStorage, not just component state - a double-click on
  // Pay, a retried request, or a page refresh mid-checkout all reuse it, so
  // the backend returns the same order instead of creating a duplicate.
  const [idempotencyKey] = useState<string>(() => getCheckoutIdempotencyKey());
  const [buyNowItem] = useState<CartItem | null>(() => getBuyNowItem());
  const { items: cartItems, clearCart, removeFromCart } = useCart();
  const { addOrder } = useOrders();
  const { email, userName } = useCurrentUser();
  const purchasedIds = usePurchasedTranscriptIds();
  const { value: isOrderConfirmed, setTrue: confirmOrder } = useBoolean();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Cart contents can go stale relative to ownership - e.g. an item bought
  // once already but still left sitting in the cart from before. Filter it
  // out here rather than letting the backend reject the whole checkout.
  const rawItems = buyNowItem ? [buyNowItem] : cartItems;
  const items = rawItems.filter((item) => !purchasedIds.includes(item.id));
  const alreadyOwnedCount = rawItems.length - items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;

  useEffect(() => {
    if (alreadyOwnedCount > 0) {
      enqueueSnackbar(
        alreadyOwnedCount === 1
          ? "One item was removed from checkout - you already own it."
          : `${alreadyOwnedCount} items were removed from checkout - you already own them.`,
        { variant: "info" },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyOwnedCount]);

  if (isOrderConfirmed && confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />;
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <div className="mx-auto max-w-[1400px] px-6 py-10 text-center">
            <p className="text-text-secondary">
              {buyNowItem
                ? "You already own this transcript."
                : "Your cart is empty."}
            </p>
            <Link to={APP_ROUTES.transcripts}>
              <Button
                variant="contained"
                label="Browse Transcripts"
                className="mt-4"
              />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const finishOrder = (confirmed: Order) => {
    clearCheckoutIdempotencyKey();
    addOrder(confirmed);
    setConfirmedOrder(confirmed);
    enqueueSnackbar("Order placed successfully.", { variant: "success" });
    if (buyNowItem) {
      clearBuyNowItem();
      // Avoid a duplicate purchase if it's also sitting in the cart.
      removeFromCart(buyNowItem.id);
    } else {
      clearCart();
    }
    confirmOrder();
  };

  const handlePay = async () => {
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const order = await createRazorpayOrder(
        {
          amount: total,
          currency: "USD",
          transcriptIds: items.map((item) => item.id),
        },
        idempotencyKey,
      );

      const onPaymentSuccess = async (response: VerifyPaymentPayload) => {
        try {
          const confirmed = await resolveConfirmedOrder(order.orderId, response, {
            id: order.orderId,
            items,
            total,
            createdAt: new Date().toISOString(),
          });
          finishOrder(confirmed);
        } catch (error) {
          console.error("Failed to verify payment:", error);
          const message =
            "We couldn't confirm your payment. If you were charged, please contact support.";
          setPaymentError(message);
          enqueueSnackbar(message, { variant: "error" });
        } finally {
          setIsSubmitting(false);
        }
      };

      const razorpay = new window.Razorpay(
        buildRazorpayOptions(
          order,
          { name: userName ?? undefined, email: email ?? undefined },
          onPaymentSuccess,
          () => setIsSubmitting(false),
        ),
      );

      razorpay.open();
    } catch (error) {
      console.error("Failed to start payment:", error);
      // Surface the backend's actual reason (e.g. "You already own one or
      // more of these items.") instead of a generic message that hides why
      // checkout was rejected - only fall back for a genuine network/gateway
      // failure, which has no useful message of its own.
      const message =
        error instanceof ApiError ? error.message : "We couldn't start the payment. Please try again.";
      setPaymentError(message);
      enqueueSnackbar(message, { variant: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PaymentProcessing active={isSubmitting} />
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <BackButton
            label={buyNowItem ? "Back To Transcripts" : "Back To Cart"}
            to={buyNowItem ? APP_ROUTES.transcripts : APP_ROUTES.cart}
          />

          <h1 className="mt-4 text-3xl font-bold text-text-primary">
            Checkout
          </h1>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">
              <OrderDetails items={items} />
            </div>
            <div className="lg:w-100 lg:shrink-0">
              <OrderSummary
                itemCount={items.length}
                subtotal={subtotal}
                total={total}
                isSubmitting={isSubmitting}
                onPay={handlePay}
                error={paymentError}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
