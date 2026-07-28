import { Link } from "react-router-dom";
import DownloadTranscriptButton from "../../../transcripts/components/download-transcript-button/DownloadTranscriptButton";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import type { Order } from "../../../orders/types";

type OrderCardProps = {
  order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-6">
      <div className="flex flex-col gap-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4"
          >
            <div>
              <Link
                to={APP_ROUTES.transcriptDetail.replace(":id", item.id)}
                className="text-sm font-medium text-text-primary hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-xs text-text-secondary">{item.domain}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm text-text-secondary">${item.price}</span>
              <DownloadTranscriptButton transcript={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
