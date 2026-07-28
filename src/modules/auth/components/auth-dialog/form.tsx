import { useContext, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDefaultFormTheme } from "../../../../common/defaultFormTheme";
import { useThemeMode } from "../../../../context/ThemeModeContext";
import { LoadingContext } from "../../../../components/loading/context";
import {
  signIn,
  register as registerUser,
  sendForgotPasswordLink,
  sendRegisterOtp,
} from "../../authService";
import { processToken } from "../../../../utils/authUtils";
import { useCart } from "../../../cart/hooks/useCart";
import SignInFields from "./sign-in-fields";
import RegisterFields from "./register-fields";
import RegisterOtpFields from "./register-otp-fields";
import ForgotPasswordFields from "./forgot-password-fields";
import type {
  AuthDialogMode,
  ForgotPasswordFormValues,
  RegisterFormValues,
  RegisterOtpFormValues,
  SignInFormValues,
} from "../../types";

type AuthFormProps = {
  mode: AuthDialogMode;
  setMode: (mode: AuthDialogMode) => void;
  handleSubmitClose: () => void;
};

const signInDefaultValues: SignInFormValues = { workEmail: "", password: "" };
const registerDefaultValues: RegisterFormValues = {
  fullName: "",
  workEmail: "",
  companyName: "",
  password: "",
};
const forgotPasswordDefaultValues: ForgotPasswordFormValues = { email: "" };
const registerOtpDefaultValues: RegisterOtpFormValues = { otp: "" };

export default function AuthForm({
  mode,
  setMode,
  handleSubmitClose,
}: AuthFormProps) {
  const signInMethods = useForm<SignInFormValues>({
    defaultValues: signInDefaultValues,
  });
  const registerMethods = useForm<RegisterFormValues>({
    defaultValues: registerDefaultValues,
  });
  const forgotPasswordMethods = useForm<ForgotPasswordFormValues>({
    defaultValues: forgotPasswordDefaultValues,
  });
  const registerOtpMethods = useForm<RegisterOtpFormValues>({
    defaultValues: registerOtpDefaultValues,
  });
  const { mode: themeMode } = useThemeMode();
  const defaultTheme = useMemo(
    () => createTheme(getDefaultFormTheme(themeMode)),
    [themeMode],
  );
  const { mergeGuestCartAfterAuth } = useCart();
  const { setLoading } = useContext(LoadingContext);

  // Sign-up is two steps: collect details, then verify OTP to create the account.
  const [registerStep, setRegisterStep] = useState<"details" | "otp">(
    "details",
  );
  const [pendingRegisterData, setPendingRegisterData] =
    useState<RegisterFormValues | null>(null);
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);

  // Reset multi-step state on mode change so reopening starts fresh.
  useEffect(() => {
    if (mode !== "register") {
      setRegisterStep("details");
      setPendingRegisterData(null);
      registerOtpMethods.reset(registerOtpDefaultValues);
    }
    if (mode !== "forgot-password") {
      setIsResetLinkSent(false);
      forgotPasswordMethods.reset(forgotPasswordDefaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const onSignIn = async (data: SignInFormValues) => {
    setLoading(true);
    try {
      const response = await signIn(data);
      processToken(response.token, response.user);
      await mergeGuestCartAfterAuth();
      handleSubmitClose();
    } catch (error) {
      signInMethods.setError("password", {
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRegisterDetailsSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await sendRegisterOtp(data.workEmail);
      setPendingRegisterData(data);
      setRegisterStep("otp");
    } catch (error) {
      registerMethods.setError("workEmail", {
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyRegisterOtp = async ({ otp }: RegisterOtpFormValues) => {
    if (!pendingRegisterData) return;

    setLoading(true);
    try {
      const response = await registerUser(pendingRegisterData, otp);
      processToken(response.token, response.user);
      await mergeGuestCartAfterAuth();
      handleSubmitClose();
    } catch (error) {
      registerOtpMethods.setError("otp", {
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onForgotPasswordSubmit = async ({
    email,
  }: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      await sendForgotPasswordLink(email);
      setIsResetLinkSent(true);
    } catch (error) {
      forgotPasswordMethods.setError("email", {
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === "signin") {
    return (
      <ThemeProvider theme={defaultTheme}>
        <FormProvider {...signInMethods}>
          <form onSubmit={signInMethods.handleSubmit(onSignIn)} noValidate>
            <SignInFields
              onSwitchToRegister={() => setMode("register")}
              onForgotPassword={() => {
                forgotPasswordMethods.setValue(
                  "email",
                  signInMethods.getValues("workEmail"),
                );
                setMode("forgot-password");
              }}
            />
          </form>
        </FormProvider>
      </ThemeProvider>
    );
  }

  if (mode === "forgot-password") {
    return (
      <ThemeProvider theme={defaultTheme}>
        <FormProvider {...forgotPasswordMethods}>
          <form
            onSubmit={forgotPasswordMethods.handleSubmit(
              onForgotPasswordSubmit,
            )}
            noValidate
          >
            <ForgotPasswordFields
              isLinkSent={isResetLinkSent}
              onBackToSignIn={() => {
                signInMethods.setValue(
                  "workEmail",
                  forgotPasswordMethods.getValues("email"),
                );
                setMode("signin");
              }}
            />
          </form>
        </FormProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {registerStep === "details" ? (
        <FormProvider {...registerMethods}>
          <form
            onSubmit={registerMethods.handleSubmit(onRegisterDetailsSubmit)}
            noValidate
          >
            <RegisterFields
              onSwitchToSignIn={() => setMode("signin")}
            />
          </form>
        </FormProvider>
      ) : (
        <FormProvider {...registerOtpMethods}>
          <form
            onSubmit={registerOtpMethods.handleSubmit(onVerifyRegisterOtp)}
            noValidate
          >
            <RegisterOtpFields
              email={pendingRegisterData?.workEmail ?? ""}
              onResend={() => {
                sendRegisterOtp(pendingRegisterData?.workEmail ?? "").catch(
                  (error) => {
                    registerOtpMethods.setError("otp", {
                      message: (error as Error).message,
                    });
                  },
                );
              }}
              onBack={() => setRegisterStep("details")}
            />
          </form>
        </FormProvider>
      )}
    </ThemeProvider>
  );
}
