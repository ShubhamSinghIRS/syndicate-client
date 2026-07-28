import Chip from "../../../../components/chip/Chip";
import DownloadButton from "../../../../components/download-button/DownloadButton";
import { formatDate } from "../../../../utils/dateUtils";
import { viewOrderReceipt } from "../../../orders/ordersService";
import { paidChipSx } from "./InvoiceList.styles";
import type { Order } from "../../../orders/types";

type InvoiceListProps = {
  orders: Order[];
};

const invoiceNumber = (orderId: string): string =>
  `#INV-${orderId.slice(-8).toUpperCase()}`;

export default function InvoiceList({ orders }: InvoiceListProps) {
  const rows = orders.flatMap((order) =>
    order.items.map((item) => ({ order, item })),
  );

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-xl font-bold text-text-primary">Invoices</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Billing history for all transcripts purchased
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-sm text-text-secondary">
          No invoices yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto border-t border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <th className="py-3 pr-4 font-semibold">Invoice</th>
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
                      label="PDF"
                      styles={{ padding: "0 14px", height: "30px", fontSize: "12px" }}
                      onClick={() =>
                        viewOrderReceipt(order.id).catch((err) =>
                          console.error("Failed to load receipt:", err),
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
