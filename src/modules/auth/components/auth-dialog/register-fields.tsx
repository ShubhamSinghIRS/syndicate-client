import Grid from "@mui/material/Grid";
import { HookTextField } from "../../../../components/form-fields/SLFieldTextField";
import Button from "../../../../components/button/Button";
import { useHookFormContext } from "../../../../utils/hooks/useHookFormContext";
import { validRegex } from "../../../../utils/isValidType";
import { commonInputStyles } from "../../../../common/input-styles";
import { usePasswordVisibility } from "./usePasswordVisibility";
import PasswordRequirements from "./PasswordRequirements";
import {
  COMPANY_NAME_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
} from "../../constants";
import type { RegisterFormValues } from "../../types";

type RegisterFieldsProps = {
  onSwitchToSignIn: () => void;
};

export default function RegisterFields({
  onSwitchToSignIn,
}: RegisterFieldsProps) {
  const { registerState, watch } = useHookFormContext<RegisterFormValues>();
  const passwordVisibility = usePasswordVisibility();
  const password = watch("password") || "";

  return (
    <Grid container spacing={2} mt="1px">
      <HookTextField
        {...registerState("fullName")}
        rules={{
          required: { value: true, message: "This field is required" },
          maxLength: {
            value: FULL_NAME_MAX_LENGTH,
            message: `Name must be at most ${FULL_NAME_MAX_LENGTH} characters`,
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Full name",
          required: true,
          autoComplete: "name",
          inputProps: { maxLength: FULL_NAME_MAX_LENGTH },
        }}
        gridProps={{ xs: 12 }}
      />
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
        rules={{
          required: { value: true, message: "This field is required" },
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
          maxLength: {
            value: PASSWORD_MAX_LENGTH,
            message: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
          },
          pattern: {
            value: validRegex("password"),
            message:
              "Password must include an uppercase letter, a lowercase letter, a number, and a special character",
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Password",
          required: true,
          autoComplete: "new-password",
          inputProps: { maxLength: PASSWORD_MAX_LENGTH },
          ...passwordVisibility,
        }}
        gridProps={{ xs: 12 }}
      />
      <Grid item xs={12} sx={{ pt: "4px !important" }}>
        <PasswordRequirements password={password} />
      </Grid>
      <HookTextField
        {...registerState("companyName")}
        rules={{
          maxLength: {
            value: COMPANY_NAME_MAX_LENGTH,
            message: `Company name must be at most ${COMPANY_NAME_MAX_LENGTH} characters`,
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Company name",
          autoComplete: "company_name",
          inputProps: { maxLength: COMPANY_NAME_MAX_LENGTH },
        }}
        gridProps={{ xs: 12 }}
      />

      <Grid item xs={12}>
        <Button
          variant="contained"
          label="Sign Up"
          buttonType="submit"
          className="w-full"
        />
      </Grid>

      <Grid item xs={12} className="text-center">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-accent-2 underline font-medium cursor-pointer"
          >
            Login
          </button>
        </span>
      </Grid>
    </Grid>
  );
}
