import { useEffect, useMemo, useState } from "react";
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
import {
  ALREADY_OWNED_SINGLE_MESSAGE,
  alreadyOwnedPluralMessage,
  BACK_TO_CART_LABEL,
  BACK_TO_TRANSCRIPTS_LABEL,
  BROWSE_TRANSCRIPTS_LABEL,
  BUY_NOW_OWNED_BODY,
  BUY_NOW_OWNED_HEADING,
  CART_EMPTY_BODY,
  CART_EMPTY_HEADING,
  CHECKOUT_HEADING,
  CURRENCY_CODE,
  ORDER_PLACED_MESSAGE,
  PAYMENT_START_FAILED_MESSAGE,
  PAYMENT_VERIFY_FAILED_MESSAGE,
  RAZORPAY_LOAD_FAILED_MESSAGE,
  RAZORPAY_MERCHANT_NAME,
  RAZORPAY_PAYMENT_DESCRIPTION,
} from "./constants";
import OrderDetails from "./components/order-summary/OrderDetails";
import OrderSummary from "./components/order-summary/OrderSummary";
import OrderConfirmation from "./components/order-confirmation/OrderConfirmation";
import PaymentProcessing from "./components/payment-processing/PaymentProcessing";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ShoppingCartIcon from "../../icons/ShoppingCart/ShoppingCart";
import CheckCircleIcon from "../../icons/CheckCircle/CheckCircle";
import { APP_ROUTES } from "../../constants/appRoutes";
import type { CartItem } from "../cart/types";
import type { CreateRazorpayOrderResponse, Order, VerifyPaymentPayload } from "../orders/types";

// Payment is already verified; a failed fetchOrderById falls back to the known order.
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
  name: RAZORPAY_MERCHANT_NAME,
  description: RAZORPAY_PAYMENT_DESCRIPTION,
  prefill,
  handler: onSuccess,
  modal: {
    ondismiss: onDismiss,
  },
});

export default function Checkout() {
  const [buyNowItem] = useState<CartItem | null>(() => getBuyNowItem());
  const { items: cartItems, clearCart, removeFromCart } = useCart();
  const { addOrder } = useOrders();
  const { email, userName } = useCurrentUser();
  const { purchasedIds, isLoading: isPurchasedIdsLoading } = usePurchasedTranscriptIds();
  const { value: isOrderConfirmed, setTrue: confirmOrder } = useBoolean();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Overlay only covers the gaps around Razorpay's own modal, not the whole isSubmitting window.
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Filter out already-purchased items rather than letting the backend reject checkout.
  const rawItems = buyNowItem ? [buyNowItem] : cartItems;
  const items = rawItems.filter((item) => !purchasedIds.includes(item.id));
  const alreadyOwnedCount = rawItems.length - items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;

  // Recomputes off the fingerprint string (not the array ref) when the checked-out items change.
  const itemIdsFingerprint = items.map((item) => item.id).sort().join(",");
  const idempotencyKey = useMemo(
    () => getCheckoutIdempotencyKey(items.map((item) => item.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemIdsFingerprint],
  );

  useEffect(() => {
    // Ownership isn't known yet, so this would fire on a false "not owned" read.
    if (isPurchasedIdsLoading) return;

    if (alreadyOwnedCount > 0) {
      enqueueSnackbar(
        alreadyOwnedCount === 1
          ? ALREADY_OWNED_SINGLE_MESSAGE
          : alreadyOwnedPluralMessage(alreadyOwnedCount),
        { variant: "info" },
      );

      // A refresh mid-payment can strand an already-purchased item here (finishOrder
      // never ran to clean it up), so it re-triggers this same screen on every future
      // visit until it's actually removed from storage rather than just filtered out.
      if (buyNowItem && purchasedIds.includes(buyNowItem.id)) {
        clearBuyNowItem();
      }
      cartItems.forEach((item) => {
        if (purchasedIds.includes(item.id)) {
          removeFromCart(item.id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPurchasedIdsLoading, alreadyOwnedCount]);

  if (isOrderConfirmed && confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />;
  }

  // Ownership must be confirmed before rendering, otherwise an already-owned item
  // briefly looks payable again on every refresh until the fetch settles.
  if (isPurchasedIdsLoading) {
    return <PaymentProcessing active variant="spinner" />;
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <div className="mx-auto max-w-[1400px] px-6 py-10">
            <BackButton
              label={buyNowItem ? BACK_TO_TRANSCRIPTS_LABEL : BACK_TO_CART_LABEL}
              to={buyNowItem ? APP_ROUTES.transcripts : APP_ROUTES.cart}
            />

            <h1 className="mt-4 text-3xl font-bold text-text-primary">
              {CHECKOUT_HEADING}
            </h1>

            <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-10 text-center">
              {buyNowItem ? (
                <CheckCircleIcon
                  sx={{ fontSize: 48 }}
                  className="text-text-secondary"
                />
              ) : (
                <ShoppingCartIcon
                  sx={{ fontSize: 48 }}
                  className="text-text-secondary"
                />
              )}
              <h2 className="text-xl font-bold text-text-primary">
                {buyNowItem ? BUY_NOW_OWNED_HEADING : CART_EMPTY_HEADING}
              </h2>
              <p className="text-sm text-text-secondary">
                {buyNowItem ? BUY_NOW_OWNED_BODY : CART_EMPTY_BODY}
              </p>
              <div className="mt-3">
                <Link to={APP_ROUTES.transcripts}>
                  <Button variant="contained" label={BROWSE_TRANSCRIPTS_LABEL} />
                </Link>
              </div>
            </div>
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
    enqueueSnackbar(ORDER_PLACED_MESSAGE, { variant: "success" });
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
    setIsCreatingOrder(true);
    setPaymentError(null);
    try {
      const order = await createRazorpayOrder(
        {
          amount: total,
          currency: CURRENCY_CODE,
          transcriptIds: items.map((item) => item.id),
        },
        idempotencyKey,
      );

      const onPaymentSuccess = async (response: VerifyPaymentPayload) => {
        setIsVerifying(true);
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
          const message = PAYMENT_VERIFY_FAILED_MESSAGE;
          setPaymentError(message);
          enqueueSnackbar(message, { variant: "error" });
          // Key deliberately not cleared: order status is unknown, so a retry must reuse it.
        } finally {
          setIsSubmitting(false);
          setIsVerifying(false);
        }
      };

      // window.Razorpay missing usually means an ad-blocker blocked the script, not a backend issue.
      if (typeof window.Razorpay !== "function") {
        throw new Error(RAZORPAY_LOAD_FAILED_MESSAGE);
      }

      const razorpay = new window.Razorpay(
        buildRazorpayOptions(
          order,
          { name: userName ?? undefined, email: email ?? undefined },
          onPaymentSuccess,
          () => {
            setIsSubmitting(false);
            setIsCreatingOrder(false);
          },
        ),
      );

      // Hand off to Razorpay's own modal instead of sitting behind it.
      setIsCreatingOrder(false);
      razorpay.open();
    } catch (error) {
      console.error("Failed to start payment:", error);
      // Generic fallback is only for a genuinely unrecognized throw.
      const message =
        error instanceof ApiError || error instanceof Error
          ? error.message
          : PAYMENT_START_FAILED_MESSAGE;
      setPaymentError(message);
      enqueueSnackbar(message, { variant: "error" });
      // Key deliberately not cleared here either, same reason as the verify-failure catch above.
      setIsSubmitting(false);
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PaymentProcessing active={isCreatingOrder} variant="spinner" />
      <PaymentProcessing active={isVerifying} variant="message" />
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <BackButton
            label={buyNowItem ? BACK_TO_TRANSCRIPTS_LABEL : BACK_TO_CART_LABEL}
            to={buyNowItem ? APP_ROUTES.transcripts : APP_ROUTES.cart}
          />

          <h1 className="mt-4 text-3xl font-bold text-text-primary">
            {CHECKOUT_HEADING}
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
