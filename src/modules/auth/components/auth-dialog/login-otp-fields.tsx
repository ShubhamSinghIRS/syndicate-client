import Grid from "@mui/material/Grid";
import { HookTextField } from "../../../../components/form-fields/SLFieldTextField";
import Button from "../../../../components/button/Button";
import { useHookFormContext } from "../../../../utils/hooks/useHookFormContext";
import { validRegex } from "../../../../utils/isValidType";
import { commonInputStyles } from "../../../../common/input-styles";
import type { LoginOtpFormValues } from "../../types";

type LoginOtpFieldsProps = {
  onBackToSignIn: () => void;
};

export default function LoginOtpFields({
  onBackToSignIn,
}: LoginOtpFieldsProps) {
  const { registerState } = useHookFormContext<LoginOtpFormValues>();

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
          label="Send OTP"
          buttonType="submit"
          className="w-full"
        />
      </Grid>

      <Grid item xs={12} className="text-center">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Prefer a password?{" "}
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
