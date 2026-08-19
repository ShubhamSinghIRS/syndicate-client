import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { COLORS } from "../../../../constants/colors";

// Matches the timeout in src/utils/services.ts closely enough to reassure
// the user before that hard timeout would otherwise surface as an error.
const SLOW_THRESHOLD_MS = 8000;

type Props = {
  active: boolean;
};

export default function PaymentProcessing({ active }: Props) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setIsSlow(false);
      return;
    }

    const timeout = setTimeout(() => setIsSlow(true), SLOW_THRESHOLD_MS);
    return () => clearTimeout(timeout);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[1400] flex flex-col items-center justify-center gap-4 bg-main-background/95 px-6 text-center backdrop-blur-sm">
      <CircularProgress sx={{ color: COLORS.accent2 }} size={48} />
      <div>
        <h2 className="text-lg font-bold text-text-primary">
          Confirming your payment...
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Please do not refresh or close this window.
        </p>
        {isSlow && (
          <p className="mt-3 max-w-sm text-sm text-text-secondary">
            This is taking longer than usual. If you were charged, your order
            will be confirmed automatically once we hear back - otherwise
            you'll be refunded.
          </p>
        )}
      </div>
    </div>
  );
}
