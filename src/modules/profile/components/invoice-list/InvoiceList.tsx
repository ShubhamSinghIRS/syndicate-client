import Chip from "../../../../components/chip/Chip";
import DownloadButton from "../../../../components/download-button/DownloadButton";
import { formatDate } from "../../../../utils/dateUtils";
import { downloadOrderReceipt } from "../../../orders/ordersService";
import { paidChipSx } from "./InvoiceList.styles";
import type { Order } from "../../../orders/types";
import InvoiceListSkeleton from "./InvoiceListSkeleton";

type InvoiceListProps = {
  orders: Order[];
  isLoading?: boolean;
};

const invoiceNumber = (orderId: string): string =>
  `#RCP-${orderId.slice(-8).toUpperCase()}`;

export default function InvoiceList({ orders, isLoading = false }: InvoiceListProps) {
  const rows = orders.flatMap((order) =>
    order.items.map((item) => ({ order, item })),
  );

  return (
    <div className="h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-xl font-bold text-text-primary">Receipts</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Billing history for all transcripts purchased
      </p>

      {isLoading ? (
        <InvoiceListSkeleton />
      ) : rows.length === 0 ? (
        <p className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-sm text-text-secondary">
          No receipts yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto border-t border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <th className="py-3 pr-4 font-semibold">Receipt</th>
                <th className="py-3 pr-4 font-semibold">Transcript</th>
                <th className="py-3 pr-4 font-semibold">Purchased</th>
                <th className="py-3 pr-4 font-semibold">Amount</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-0 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ order, item }) => (
                <tr
                  key={`${order.id}-${item.id}`}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="py-3 pr-4 font-medium text-text-primary">
                    {invoiceNumber(order.id)}
                  </td>
                  <td className="py-3 pr-4 text-text-primary">{item.title}</td>
                  <td className="py-3 pr-4 text-text-secondary">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 pr-4 text-text-primary">
                    ${item.price}
                  </td>
                  <td className="py-3 pr-4">
                    <Chip label="Paid" size="small" sx={paidChipSx} />
                  </td>
                  <td className="py-3 pr-0 text-right">
                    <DownloadButton
                      label="Download"
                      styles={{ padding: "0 14px", height: "30px", fontSize: "12px" }}
                      onClick={() =>
                        downloadOrderReceipt(order.id).catch((err) =>
                          console.error("Failed to download receipt:", err),
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
