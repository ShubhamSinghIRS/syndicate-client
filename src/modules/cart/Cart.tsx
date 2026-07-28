import { Link } from "react-router-dom";
import { useCart } from "./hooks/useCart";
import CartItem from "./components/cart-item/CartItem";
import CartSummary from "./components/cart-summary/CartSummary";
import EmptyCart from "./components/empty-cart/EmptyCart";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { APP_ROUTES } from "../../constants/appRoutes";

export default function Cart() {
  const { items, total, removeFromCart } = useCart();

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
            <span>Cart</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-text-primary">
            Transcript Cart
          </h1>

          {items.length === 0 ? (
            <div className="mt-6">
              <EmptyCart />
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="flex flex-col gap-4 lg:col-span-8">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>

              <div className="lg:col-span-4">
                <CartSummary itemCount={items.length} total={total} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
