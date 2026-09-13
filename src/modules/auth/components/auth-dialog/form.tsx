import { useContext, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDefaultFormTheme } from "../../../../common/defaultFormTheme";
import { useThemeMode } from "../../../../context/ThemeModeContext";
import { LoadingContext } from "../../../../components/loading/context";
import { ApiError, scheduleTokenRefresh } from "../../../../utils/services";
import {
  signIn,
  register as registerUser,
  sendForgotPasswordLink,
  sendLoginOtp,
  verifyLoginOtp,
  verifyRegistrationOtp,
  resendRegistrationOtp,
} from "../../authService";
import { persistUserSession } from "../../../../utils/authUtils";
import { useCart } from "../../../cart/hooks/useCart";
import SignInFields from "./sign-in-fields";
import RegisterFields from "./register-fields";
import RegisterOtpFields from "./register-otp-fields";
import ForgotPasswordFields from "./forgot-password-fields";
import LoginOtpFields from "./login-otp-fields";
import {
  FORGOT_PASSWORD_DEFAULT_VALUES,
  LOGIN_OTP_DEFAULT_VALUES,
  REGISTER_DEFAULT_VALUES,
  REGISTER_OTP_DEFAULT_VALUES,
  SIGN_IN_DEFAULT_VALUES,
} from "../../constants";
import type {
  AuthDialogMode,
  ForgotPasswordFormValues,
  LoginOtpFormValues,
  PendingAuthResponse,
  RegisterFormValues,
  RegisterOtpFormValues,
  SignInFormValues,
} from "../../types";

type AuthFormProps = {
  mode: AuthDialogMode;
  setMode: (mode: AuthDialogMode) => void;
  handleSubmitClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export default function AuthForm({
  mode,
  setMode,
  handleSubmitClose,
  onDirtyChange,
}: AuthFormProps) {
  const signInMethods = useForm<SignInFormValues>({
    defaultValues: SIGN_IN_DEFAULT_VALUES,
  });
  const registerMethods = useForm<RegisterFormValues>({
    defaultValues: REGISTER_DEFAULT_VALUES,
  });
  const forgotPasswordMethods = useForm<ForgotPasswordFormValues>({
    defaultValues: FORGOT_PASSWORD_DEFAULT_VALUES,
  });
  const registerOtpMethods = useForm<RegisterOtpFormValues>({
    defaultValues: REGISTER_OTP_DEFAULT_VALUES,
  });
  const signInOtpMethods = useForm<RegisterOtpFormValues>({
    defaultValues: REGISTER_OTP_DEFAULT_VALUES,
  });
  const loginOtpEmailMethods = useForm<LoginOtpFormValues>({
    defaultValues: LOGIN_OTP_DEFAULT_VALUES,
  });
  const loginOtpOtpMethods = useForm<RegisterOtpFormValues>({
    defaultValues: REGISTER_OTP_DEFAULT_VALUES,
  });
  const { mode: themeMode } = useThemeMode();
  const defaultTheme = useMemo(
    () => createTheme(getDefaultFormTheme(themeMode)),
    [themeMode],
  );
  const { mergeGuestCartAfterAuth } = useCart();
  const { setLoading } = useContext(LoadingContext);
  const { enqueueSnackbar } = useSnackbar();

  // Sign-up is two steps: submit details (returns pending token), then verify OTP.
  const [registerStep, setRegisterStep] = useState<"details" | "otp">(
    "details",
  );
  const [pendingRegisterEmail, setPendingRegisterEmail] = useState("");
  const [registerPendingToken, setRegisterPendingToken] = useState<
    string | null
  >(null);
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);

  // Unverified sign-in drops into the same OTP-entry step, using the returned pending token.
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [pendingSignInEmail, setPendingSignInEmail] = useState("");
  const [signInPendingToken, setSignInPendingToken] = useState<string | null>(
    null,
  );

  // Login-with-OTP mirrors the registration OTP flow: send, then verify.
  const [loginOtpStep, setLoginOtpStep] = useState<"email" | "otp">("email");
  const [pendingLoginOtpEmail, setPendingLoginOtpEmail] = useState("");
  const [loginOtpPendingToken, setLoginOtpPendingToken] = useState<
    string | null
  >(null);

  // Reset multi-step state on mode change so reopening starts fresh.
  useEffect(() => {
    if (mode !== "register") {
      setRegisterStep("details");
      setPendingRegisterEmail("");
      setRegisterPendingToken(null);
      registerOtpMethods.reset(REGISTER_OTP_DEFAULT_VALUES);
    }
    if (mode !== "signin") {
      setNeedsEmailVerification(false);
      setPendingSignInEmail("");
      setSignInPendingToken(null);
      signInOtpMethods.reset(REGISTER_OTP_DEFAULT_VALUES);
    }
    if (mode !== "forgot-password") {
      setIsResetLinkSent(false);
      forgotPasswordMethods.reset(FORGOT_PASSWORD_DEFAULT_VALUES);
    }
    if (mode !== "otp-login") {
      setLoginOtpStep("email");
      setPendingLoginOtpEmail("");
      setLoginOtpPendingToken(null);
      loginOtpEmailMethods.reset(LOGIN_OTP_DEFAULT_VALUES);
      loginOtpOtpMethods.reset(REGISTER_OTP_DEFAULT_VALUES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Determine which visible form's dirty state to report, mirroring the render logic below.
  const activeIsDirty = (() => {
    if (mode === "signin") {
      return needsEmailVerification && signInPendingToken
        ? signInOtpMethods.formState.isDirty
        : signInMethods.formState.isDirty;
    }
    if (mode === "forgot-password") {
      return forgotPasswordMethods.formState.isDirty;
    }
    if (mode === "otp-login") {
      return loginOtpStep === "otp" && loginOtpPendingToken
        ? loginOtpOtpMethods.formState.isDirty
        : loginOtpEmailMethods.formState.isDirty;
    }
    return registerStep === "details"
      ? registerMethods.formState.isDirty
      : registerOtpMethods.formState.isDirty;
  })();

  useEffect(() => {
    onDirtyChange(activeIsDirty);
  }, [activeIsDirty, onDirtyChange]);

  const onSignIn = async (data: SignInFormValues) => {
    setLoading(true);
    try {
      const response = await signIn(data);
      persistUserSession(response.user);
      scheduleTokenRefresh(response.accessTokenExpiresIn);
      await mergeGuestCartAfterAuth();
      enqueueSnackbar("Signed in successfully.", { variant: "success" });
      handleSubmitClose();
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        const pendingToken = (error.data as PendingAuthResponse | undefined)
          ?.tempToken;
        if (pendingToken) {
          setPendingSignInEmail(data.workEmail);
          setSignInPendingToken(pendingToken);
          setNeedsEmailVerification(true);
        } else {
          signInMethods.setError("password", { message: error.message });
          enqueueSnackbar(error.message, { variant: "error" });
        }
      } else {
        const message = (error as Error).message;
        signInMethods.setError("password", { message });
        enqueueSnackbar(message, { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifySignInOtp = async ({ otp }: RegisterOtpFormValues) => {
    if (!signInPendingToken) return;

    setLoading(true);
    try {
      const response = await verifyRegistrationOtp(signInPendingToken, otp);
      persistUserSession(response.user);
      scheduleTokenRefresh(response.accessTokenExpiresIn);
      await mergeGuestCartAfterAuth();
      enqueueSnackbar("Signed in successfully.", { variant: "success" });
      handleSubmitClose();
    } catch (error) {
      const message = (error as Error).message;
      signInOtpMethods.setError("otp", { message });
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onRegisterDetailsSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      setPendingRegisterEmail(data.workEmail);
      setRegisterPendingToken(response.tempToken);
      setRegisterStep("otp");
      enqueueSnackbar("OTP sent to your email.", { variant: "success" });
    } catch (error) {
      const message = (error as Error).message;
      const field = /password/i.test(message) ? "password" : "workEmail";
      registerMethods.setError(field, { message });
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyRegisterOtp = async ({ otp }: RegisterOtpFormValues) => {
    if (!registerPendingToken) return;

    setLoading(true);
    try {
      const response = await verifyRegistrationOtp(registerPendingToken, otp);
      persistUserSession(response.user);
      scheduleTokenRefresh(response.accessTokenExpiresIn);
      await mergeGuestCartAfterAuth();
      enqueueSnackbar("Registration successful.", { variant: "success" });
      handleSubmitClose();
    } catch (error) {
      const message = (error as Error).message;
      registerOtpMethods.setError("otp", { message });
      enqueueSnackbar(message, { variant: "error" });
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
      enqueueSnackbar("Reset link sent to your email.", { variant: "success" });
    } catch (error) {
      const message = (error as Error).message;
      forgotPasswordMethods.setError("email", { message });
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onLoginOtpEmailSubmit = async ({ email }: LoginOtpFormValues) => {
    setLoading(true);
    try {
      const response = await sendLoginOtp(email);
      setPendingLoginOtpEmail(email);
      setLoginOtpPendingToken(response.tempToken);
      setLoginOtpStep("otp");
      enqueueSnackbar("OTP sent to your email.", { variant: "success" });
    } catch (error) {
      const message = (error as Error).message;
      loginOtpEmailMethods.setError("email", { message });
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyLoginOtp = async ({ otp }: RegisterOtpFormValues) => {
    if (!loginOtpPendingToken) return;

    setLoading(true);
    try {
      const response = await verifyLoginOtp(loginOtpPendingToken, otp);
      persistUserSession(response.user);
      scheduleTokenRefresh(response.accessTokenExpiresIn);
      await mergeGuestCartAfterAuth();
      enqueueSnackbar("Signed in successfully.", { variant: "success" });
      handleSubmitClose();
    } catch (error) {
      const message = (error as Error).message;
      loginOtpOtpMethods.setError("otp", { message });
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (mode === "signin") {
    if (needsEmailVerification && signInPendingToken) {
      return (
        <ThemeProvider theme={defaultTheme}>
          <FormProvider {...signInOtpMethods}>
            <form
              onSubmit={signInOtpMethods.handleSubmit(onVerifySignInOtp)}
              noValidate
            >
              <RegisterOtpFields
                email={pendingSignInEmail}
                submitLabel="Verify & Sign In"
                onResend={() => {
                  resendRegistrationOtp(signInPendingToken)
                    .then((response) => {
                      setSignInPendingToken(response.tempToken);
                      enqueueSnackbar("A new OTP has been sent to your email.", {
                        variant: "success",
                      });
                    })
                    .catch((error) => {
                      const message = (error as Error).message;
                      signInOtpMethods.setError("otp", { message });
                      enqueueSnackbar(message, { variant: "error" });
                    });
                }}
                onBack={() => setNeedsEmailVerification(false)}
              />
            </form>
          </FormProvider>
        </ThemeProvider>
      );
    }

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
              onLoginWithOtp={() => {
                loginOtpEmailMethods.setValue(
                  "email",
                  signInMethods.getValues("workEmail"),
                );
                setMode("otp-login");
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

  if (mode === "otp-login") {
    if (loginOtpStep === "otp" && loginOtpPendingToken) {
      return (
        <ThemeProvider theme={defaultTheme}>
          <FormProvider {...loginOtpOtpMethods}>
            <form
              onSubmit={loginOtpOtpMethods.handleSubmit(onVerifyLoginOtp)}
              noValidate
            >
              <RegisterOtpFields
                email={pendingLoginOtpEmail}
                submitLabel="Verify"
                onResend={() => {
                  sendLoginOtp(pendingLoginOtpEmail)
                    .then((response) => {
                      setLoginOtpPendingToken(response.tempToken);
                      enqueueSnackbar("A new OTP has been sent to your email.", {
                        variant: "success",
                      });
                    })
                    .catch((error) => {
                      const message = (error as Error).message;
                      loginOtpOtpMethods.setError("otp", { message });
                      enqueueSnackbar(message, { variant: "error" });
                    });
                }}
                onBack={() => setLoginOtpStep("email")}
              />
            </form>
          </FormProvider>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={defaultTheme}>
        <FormProvider {...loginOtpEmailMethods}>
          <form
            onSubmit={loginOtpEmailMethods.handleSubmit(onLoginOtpEmailSubmit)}
            noValidate
          >
            <LoginOtpFields
              onBackToSignIn={() => {
                signInMethods.setValue(
                  "workEmail",
                  loginOtpEmailMethods.getValues("email"),
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
              email={pendingRegisterEmail}
              onResend={() => {
                if (!registerPendingToken) return;
                resendRegistrationOtp(registerPendingToken)
                  .then((response) => {
                    setRegisterPendingToken(response.tempToken);
                    enqueueSnackbar("A new OTP has been sent to your email.", {
                      variant: "success",
                    });
                  })
                  .catch((error) => {
                    const message = (error as Error).message;
                    registerOtpMethods.setError("otp", { message });
                    enqueueSnackbar(message, { variant: "error" });
                  });
              }}
              onBack={() => setRegisterStep("details")}
            />
          </form>
        </FormProvider>
      )}
    </ThemeProvider>
  );
}
