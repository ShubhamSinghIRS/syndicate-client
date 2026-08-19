import CartItem from "../../../cart/components/cart-item/CartItem";
import type { CartItem as CartItemType } from "../../../cart/types";

type OrderDetailsProps = {
  items: CartItemType[];
};

export default function OrderDetails({ items }: OrderDetailsProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-lg font-bold text-text-primary">Purchase details</h2>

      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
