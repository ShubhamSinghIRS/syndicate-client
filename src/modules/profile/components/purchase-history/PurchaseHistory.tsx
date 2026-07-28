import { Link } from "react-router-dom";
import Button from "../../../../components/button/Button";
import DownloadTranscriptButton from "../../../transcripts/components/download-transcript-button/DownloadTranscriptButton";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import type { Order } from "../../../orders/types";

type PurchaseHistoryProps = {
  orders: Order[];
};

export default function PurchaseHistory({ orders }: PurchaseHistoryProps) {
  const rows = orders.flatMap((order) =>
    order.items.map((item) => ({ order, item })),
  );

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-xl font-bold text-text-primary">My Purchases</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Transcripts you've bought
      </p>

      {rows.length === 0 ? (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
          <p className="text-text-secondary">
            You haven't purchased any transcripts yet.
          </p>
          <div className="mt-4">
            <Link to={APP_ROUTES.transcripts}>
              <Button variant="contained" label="Browse Transcripts" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col border-t border-gray-200 dark:border-gray-800">
          {rows.map(({ order, item }) => (
            <div
              key={`${order.id}-${item.id}`}
              className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 py-4"
            >
              <div>
                <Link
                  to={APP_ROUTES.transcriptDetail.replace(":id", item.id)}
                  className="text-sm font-medium text-text-primary hover:underline"
                >
                  {item.title}
                </Link>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <DownloadTranscriptButton transcript={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
