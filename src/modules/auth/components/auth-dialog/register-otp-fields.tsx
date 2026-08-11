import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { HookTextField } from "../../../../components/form-fields/SLFieldTextField";
import Button from "../../../../components/button/Button";
import { useHookFormContext } from "../../../../utils/hooks/useHookFormContext";
import { commonInputStyles } from "../../../../common/input-styles";
import type { RegisterOtpFormValues } from "../../types";

type RegisterOtpFieldsProps = {
  email: string;
  onResend: () => void;
  onBack: () => void;
  submitLabel?: string;
};

const RESEND_SECONDS = 60;

export default function RegisterOtpFields({
  email,
  onResend,
  onBack,
  submitLabel = "Verify",
}: RegisterOtpFieldsProps) {
  const { registerState } = useHookFormContext<RegisterOtpFormValues>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS);
    onResend();
  };

  return (
    <Grid container spacing={2} mt="1px">
      <Grid item xs={12}>
        <p className="text-sm text-text-secondary leading-snug">
          Enter the OTP sent to{" "}
          <span className="font-semibold text-text-primary break-all">{email}</span>.
        </p>
      </Grid>

      <HookTextField
        {...registerState("otp")}
        rules={{
          required: { value: true, message: "This field is required" },
          minLength: { value: 6, message: "Enter the 6-digit OTP" },
          maxLength: { value: 6, message: "Enter the 6-digit OTP" },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "OTP",
          required: true,
          autoComplete: "one-time-code",
        }}
        gridProps={{ xs: 12 }}
      />

      <Grid item xs={12} className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 underline"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 underline disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-600 disabled:no-underline"
        >
          {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : "Resend OTP"}
        </button>
      </Grid>

      <Grid item xs={12} className="flex justify-end">
        <Button
          variant="contained"
          label={submitLabel}
          buttonType="submit"
        />
      </Grid>
    </Grid>
  );
}
