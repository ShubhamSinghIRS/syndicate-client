import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { getDefaultFormTheme } from "../../../common/defaultFormTheme";
import { useThemeMode } from "../../../context/ThemeModeContext";
import { useIsMobile } from "../../../utils/hooks/useIsMobile";
import { LoadingContext } from "../../../components/loading/context";
import Loading from "../../../components/loading/Loading";
import { useBoolean } from "../../../utils/hooks/useBoolean";
import { HookTextField } from "../../../components/form-fields/SLFieldTextField";
import Button from "../../../components/button/Button";
import WarningDialog from "../../../components/form-close-warning/WarningDialog";
import { useHookFormContext } from "../../../utils/hooks/useHookFormContext";
import { validRegex } from "../../../utils/isValidType";
import { commonInputStyles } from "../../../common/input-styles";
import { COLORS } from "../../../constants/colors";
import { APP_ROUTES } from "../../../constants/appRoutes";
import { resetPassword } from "../authService";
import { usePasswordVisibility } from "../components/auth-dialog/usePasswordVisibility";
import PasswordRequirements from "../components/auth-dialog/PasswordRequirements";
import { useAuthDialog } from "../context/AuthDialogContext";
import { authDialogPaperSx } from "../components/auth-dialog/AuthDialog.styles";
import type { ResetPasswordFormValues } from "../types";

const defaultValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

function ResetPasswordFields() {
  const { registerState, watch } =
    useHookFormContext<ResetPasswordFormValues>();
  const passwordVisibility = usePasswordVisibility();
  const confirmPasswordVisibility = usePasswordVisibility();

  return (
    <Grid container spacing={2} mt="1px">
      <HookTextField
        {...registerState("password")}
        rules={{
          required: { value: true, message: "This field is required" },
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
          pattern: {
            value: validRegex("password"),
            message:
              "Password must include an uppercase letter, a lowercase letter, a number, and a special character",
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "New password",
          required: true,
          autoComplete: "new-password",
          ...passwordVisibility,
        }}
        gridProps={{ xs: 12 }}
      />
      <Grid item xs={12} sx={{ pt: "4px !important" }}>
        <PasswordRequirements password={watch("password") || ""} />
      </Grid>
      <HookTextField
        {...registerState("confirmPassword")}
        rules={{
          required: { value: true, message: "This field is required" },
          validate: (value: string) =>
            value === watch("password") || "Passwords do not match",
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Confirm new password",
          required: true,
          autoComplete: "new-password",
          ...confirmPasswordVisibility,
        }}
        gridProps={{ xs: 12 }}
      />

      <Grid item xs={12}>
        <Button
          variant="contained"
          label="Reset password"
          buttonType="submit"
          className="w-full"
        />
      </Grid>
    </Grid>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { openAuthDialog } = useAuthDialog();
  const { mode: themeMode } = useThemeMode();
  const isMobile = useIsMobile();
  const defaultTheme = useMemo(
    () => createTheme(getDefaultFormTheme(themeMode)),
    [themeMode],
  );
  const { value: loading, setValue: setLoading } = useBoolean();
  const [isDone, setIsDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const {
    value: isWarningOpen,
    setTrue: openWarning,
    setFalse: closeWarning,
  } = useBoolean();

  const methods = useForm<ResetPasswordFormValues>({ defaultValues });

  const onSubmit = async ({ password }: ResetPasswordFormValues) => {
    if (!token) return;

    setLoading(true);
    setSubmitError(null);
    try {
      await resetPassword(token, password);
      setIsDone(true);
      enqueueSnackbar("Password reset successful.", { variant: "success" });
    } catch (error) {
      const message = (error as Error).message;
      setSubmitError(message);
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const goToSignIn = () => {
    navigate(APP_ROUTES.home);
    openAuthDialog("signin");
  };

  const goHome = () => navigate(APP_ROUTES.home);

  const requestClose = () => {
    if (methods.formState.isDirty) {
      openWarning();
    } else {
      goHome();
    }
  };

  const subtitle = !token
    ? "This password reset link is missing or malformed."
    : "Enter your new password below.";

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open
        onClose={requestClose}
        maxWidth="md"
        fullWidth
        sx={authDialogPaperSx}
      >
        <div className="flex h-full">
          {!isMobile && (
            <div className="relative w-[42%] shrink-0 h-full overflow-hidden bg-[#212631]">
              <img
                src="/Design-01.svg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="relative flex-1 h-full p-6 sm:p-8 flex flex-col justify-center overflow-y-auto">
            <LoadingContext.Provider value={{ loading, setLoading }}>
              <Loading loading={loading} />

              <IconButton
                onClick={requestClose}
                aria-label="Close"
                className="absolute! right-3! top-3!"
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <div className="flex flex-col items-center text-center">
                <img
                  src="/assets/infollion_logo_200x100.png"
                  alt="Infollion"
                  className="h-16 w-auto mx-auto"
                />
                <h2 className="mt-1.5 text-[18px] font-medium text-slate-700 dark:text-slate-200">
                  Reset Password
                </h2>
                {!isDone && !submitError && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="mt-4">
                {!token ? (
                  <div className="flex flex-col items-center py-2 text-center">
                    <ErrorOutlineIcon
                      sx={{ fontSize: 40, color: COLORS.accent2 }}
                    />
                    <p className="mt-3 text-sm font-semibold text-text-primary">
                      Invalid reset link
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Please request a new one.
                    </p>
                    <Button
                      variant="outlined"
                      label="Back to sign in"
                      onClick={goToSignIn}
                      className="mt-6"
                    />
                  </div>
                ) : isDone ? (
                  <div className="flex flex-col items-center py-2 text-center">
                    <CheckCircleIcon
                      sx={{ fontSize: 40, color: COLORS.accent2 }}
                    />
                    <p className="mt-3 text-sm font-semibold text-text-primary">
                      Password reset
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Your password has been reset successfully. You can now
                      sign in with your new password.
                    </p>
                    <Button
                      variant="contained"
                      label="Sign in"
                      onClick={goToSignIn}
                      className="mt-6"
                    />
                  </div>
                ) : submitError ? (
                  <div className="flex flex-col items-center py-2 text-center">
                    <ErrorOutlineIcon
                      sx={{ fontSize: 40, color: COLORS.accent2 }}
                    />
                    <p className="mt-3 text-sm font-semibold text-text-primary">
                      Link expired or invalid
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {submitError}
                    </p>
                    <Button
                      variant="outlined"
                      label="Back to sign in"
                      onClick={goToSignIn}
                      className="mt-6"
                    />
                  </div>
                ) : (
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                      <ResetPasswordFields />
                    </form>
                  </FormProvider>
                )}
              </div>
            </LoadingContext.Provider>
          </div>
        </div>
      </Dialog>
      <WarningDialog
        open={isWarningOpen}
        handleClose={closeWarning}
        handleYesClick={() => {
          closeWarning();
          goHome();
        }}
      />
    </ThemeProvider>
  );
}
