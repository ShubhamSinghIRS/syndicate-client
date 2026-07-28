import Button from "../../../../components/button/Button";
import Loading from "../../../../components/loading/Loading";

type OrderSummaryProps = {
  itemCount: number;
  subtotal: number;
  total: number;
  isSubmitting: boolean;
  onPay: () => void;
  error?: string | null;
};

export default function OrderSummary({
  itemCount,
  subtotal,
  total,
  isSubmitting,
  onPay,
  error,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <Loading loading={isSubmitting} />
      <h2 className="text-lg font-bold text-text-primary">Purchase summary</h2>

      <div className="mt-4 flex items-center justify-between text-text-secondary">
        <span>
          Subtotal ({itemCount} {itemCount === 1 ? "transcript" : "transcripts"})
        </span>
        <span>${subtotal}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
        <span className="font-semibold text-text-primary">Total</span>
        <span className="text-lg font-bold text-accent-2">
          USD ${total}
        </span>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4">
        <Button
          variant="contained"
          label={isSubmitting ? "Processing..." : "Pay Now"}
          onClick={onPay}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </div>
  );
}
