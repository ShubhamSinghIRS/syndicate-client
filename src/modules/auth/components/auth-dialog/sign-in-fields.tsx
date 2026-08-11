import Grid from "@mui/material/Grid";
import { HookTextField } from "../../../../components/form-fields/SLFieldTextField";
import Button from "../../../../components/button/Button";
import { useHookFormContext } from "../../../../utils/hooks/useHookFormContext";
import { validRegex } from "../../../../utils/isValidType";
import { commonInputStyles } from "../../../../common/input-styles";
import { usePasswordVisibility } from "./usePasswordVisibility";
import type { SignInFormValues } from "../../types";

type SignInFieldsProps = {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onLoginWithOtp: () => void;
};

export default function SignInFields({
  onSwitchToRegister,
  onForgotPassword,
  onLoginWithOtp,
}: SignInFieldsProps) {
  const { registerState } = useHookFormContext<SignInFormValues>();
  const passwordVisibility = usePasswordVisibility();

  return (
    <Grid container spacing={2} mt="1px">
      <HookTextField
        {...registerState("workEmail")}
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
      <HookTextField
        {...registerState("password")}
        rules={{ required: { value: true, message: "This field is required" } }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Password",
          required: true,
          autoComplete: "current-password",
          ...passwordVisibility,
        }}
        gridProps={{ xs: 12 }}
      />

      <Grid item xs={12}>
        <Button
          variant="contained"
          label="Login"
          buttonType="submit"
          className="w-full"
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="outlined"
          label="Login with OTP"
          onClick={onLoginWithOtp}
          className="w-full"
        />
      </Grid>

      <Grid item xs={12} className="text-center">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-accent-2 underline font-medium cursor-pointer"
          >
            Sign Up
          </button>
        </span>
      </Grid>

      <Grid item xs={12} className="text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 underline cursor-pointer"
        >
          Forgot password?
        </button>
      </Grid>
    </Grid>
  );
}
