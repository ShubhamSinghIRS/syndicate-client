import Grid from "@mui/material/Grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { HookTextField } from "../../../../components/form-fields/SLFieldTextField";
import Button from "../../../../components/button/Button";
import { useHookFormContext } from "../../../../utils/hooks/useHookFormContext";
import { validRegex } from "../../../../utils/isValidType";
import { commonInputStyles } from "../../../../common/input-styles";
import { COLORS } from "../../../../constants/colors";
import type { ForgotPasswordFormValues } from "../../types";

type ForgotPasswordFieldsProps = {
  isLinkSent: boolean;
  onBackToSignIn: () => void;
};

export default function ForgotPasswordFields({
  isLinkSent,
  onBackToSignIn,
}: ForgotPasswordFieldsProps) {
  const { registerState } = useHookFormContext<ForgotPasswordFormValues>();

  if (isLinkSent) {
    return (
      <div className="flex flex-col items-center py-2 text-center">
        <CheckCircleIcon sx={{ fontSize: 40, color: COLORS.accent2 }} />
        <p className="mt-3 text-sm font-semibold text-text-primary">
          Reset link sent
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Reset link shared with you on your registered email.
        </p>
        <Button
          variant="outlined"
          label="Back to sign in"
          onClick={onBackToSignIn}
          className="mt-6"
        />
      </div>
    );
  }

  return (
    <Grid container spacing={2} mt="1px">
      <HookTextField
        {...registerState("email")}
        rules={{
          required: { value: true, message: "This field is required" },
          pattern: {
            value: validRegex("email"),
            message: "Please enter a correct email",
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Email",
          required: true,
          autoComplete: "email",
        }}
        gridProps={{ xs: 12 }}
      />

      <Grid item xs={12}>
        <Button
          variant="contained"
          label="Send reset link"
          buttonType="submit"
          className="w-full"
        />
      </Grid>

      <Grid item xs={12} className="text-center">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-accent-2 underline font-medium cursor-pointer"
          >
            Login
          </button>
        </span>
      </Grid>
    </Grid>
  );
}
