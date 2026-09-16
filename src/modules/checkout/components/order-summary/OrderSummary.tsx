import Button from "../../../../components/button/Button";
import {
  CURRENCY_CODE,
  PAY_NOW_LABEL,
  PURCHASE_SUMMARY_HEADING,
  subtotalLabel,
  TOTAL_LABEL,
} from "../../constants";

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
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
      <h2 className="text-lg font-bold text-text-primary">{PURCHASE_SUMMARY_HEADING}</h2>

      <div className="mt-4 flex items-center justify-between text-text-secondary">
        <span>{subtotalLabel(itemCount)}</span>
        <span>${subtotal}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
        <span className="font-semibold text-text-primary">{TOTAL_LABEL}</span>
        <span className="text-lg font-bold text-accent-2">
          {CURRENCY_CODE} ${total}
        </span>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4">
        <Button
          variant="contained"
          label={PAY_NOW_LABEL}
          onClick={onPay}
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </div>
  );
}
