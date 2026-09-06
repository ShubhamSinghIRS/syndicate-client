import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { COLORS } from "../../../../constants/colors";
import {
  PAYMENT_CONFIRMING_BODY,
  PAYMENT_CONFIRMING_HEADING,
  PAYMENT_PROCESSING_SLOW_THRESHOLD_MS,
  PAYMENT_SLOW_MESSAGE,
} from "../../constants";

type Props = {
  active: boolean;
  // "spinner": bare full-screen spinner, for the brief gap before Razorpay's
  // own modal opens - no messaging needed since nothing payment-related has
  // happened yet. "message": the fuller "don't close this window" state,
  // for after the user has actually paid and we're confirming it server-side.
  variant?: "spinner" | "message";
};

export default function PaymentProcessing({ active, variant = "message" }: Props) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!active || variant !== "message") {
      setIsSlow(false);
      return;
    }

    const timeout = setTimeout(() => setIsSlow(true), PAYMENT_PROCESSING_SLOW_THRESHOLD_MS);
    return () => clearTimeout(timeout);
  }, [active, variant]);

  if (!active) return null;

  if (variant === "spinner") {
    return (
      <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-main-background/95 backdrop-blur-sm">
        <CircularProgress sx={{ color: COLORS.accent2 }} size={64} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1400] flex flex-col items-center justify-center gap-4 bg-main-background/95 px-6 text-center backdrop-blur-sm">
      <CircularProgress sx={{ color: COLORS.accent2 }} size={48} />
      <div>
        <h2 className="text-lg font-bold text-text-primary">
          {PAYMENT_CONFIRMING_HEADING}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          {PAYMENT_CONFIRMING_BODY}
        </p>
        {isSlow && (
          <p className="mt-3 max-w-sm text-sm text-text-secondary">
            {PAYMENT_SLOW_MESSAGE}
          </p>
        )}
      </div>
    </div>
  );
}
