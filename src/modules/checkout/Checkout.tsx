import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../cart/hooks/useCart";
import { useOrders } from "../orders/hooks/useOrders";
import { createRazorpayOrder, verifyRazorpayPayment } from "../orders/ordersService";
import { useCurrentUser } from "../profile/hooks/useCurrentUser";
import { useBoolean } from "../../utils/hooks/useBoolean";
import { getBuyNowItem, clearBuyNowItem } from "./buyNowStorage";
import OrderDetails from "./components/order-summary/OrderDetails";
import OrderSummary from "./components/order-summary/OrderSummary";
import OrderConfirmation from "./components/order-confirmation/OrderConfirmation";
import Button from "../../components/button/Button";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { APP_ROUTES } from "../../constants/appRoutes";
import type { CartItem } from "../cart/types";
import type { Order } from "../orders/types";

export default function Checkout() {
  const [buyNowItem] = useState<CartItem | null>(() => getBuyNowItem());
  const { items: cartItems, total: cartTotal, clearCart, removeFromCart } = useCart();
  const { addOrder } = useOrders();
  const { email, userName } = useCurrentUser();
  const { value: isOrderConfirmed, setTrue: confirmOrder } = useBoolean();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const items = buyNowItem ? [buyNowItem] : cartItems;
  const subtotal = buyNowItem ? buyNowItem.price : cartTotal;
  const total = subtotal;

  if (isOrderConfirmed && confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />;
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <div className="mx-auto max-w-[1400px] px-6 py-10 text-center">
            <p className="text-text-secondary">Your cart is empty.</p>
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

  const finishOrder = (orderId: string) => {
    const confirmed: Order = {
      id: orderId,
      items,
      total,
      createdAt: new Date().toISOString(),
    };
    addOrder(confirmed);
    setConfirmedOrder(confirmed);
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
      const order = await createRazorpayOrder({
        amount: total,
        currency: "USD",
        transcriptIds: items.map((item) => item.id),
      });

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Infollion",
        description: "Transcript purchase",
        prefill: {
          name: userName ?? undefined,
          email: email ?? undefined,
        },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            finishOrder(order.orderId);
          } catch (error) {
            console.error("Failed to verify payment:", error);
            setPaymentError(
              "We couldn't confirm your payment. If you were charged, please contact support.",
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      });

      razorpay.open();
    } catch (error) {
      console.error("Failed to start payment:", error);
      setPaymentError("We couldn't start the payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link
              to={APP_ROUTES.transcripts}
              className="underline hover:no-underline text-text-primary font-medium"
            >
              All transcripts
            </Link>
            <span>/</span>
            <Link
              to={APP_ROUTES.cart}
              className="underline hover:no-underline text-text-primary font-medium"
            >
              Cart
            </Link>
            <span>/</span>
            <span>Checkout</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-text-primary">
            Checkout
          </h1>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
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
