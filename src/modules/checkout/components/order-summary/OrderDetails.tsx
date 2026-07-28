import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import type { CartItem } from "../../../cart/types";

type OrderDetailsProps = {
  items: CartItem[];
};

export default function OrderDetails({ items }: OrderDetailsProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-lg font-bold text-text-primary">Purchase details</h2>

      <div className="mt-4 flex flex-col">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={
              index > 0 ? "mt-4 border-t border-gray-200 dark:border-gray-800 pt-4" : undefined
            }
          >
            <div className="flex items-start justify-between gap-4">
              <Link
                to={APP_ROUTES.transcriptDetail.replace(":id", item.id)}
                className="font-semibold text-text-primary hover:underline"
              >
                {item.title}
              </Link>
              <span className="shrink-0 font-semibold text-text-primary">
                ${item.price}
              </span>
            </div>
            {/* <span className="mt-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-2">
              {item.domain}
            </span> */}
          </div>
        ))}
      </div>
    </div>
  );
}
