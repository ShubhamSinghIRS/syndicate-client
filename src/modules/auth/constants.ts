import type { AuthDialogMode } from "./types";

export const MODE_COPY: Record<
  AuthDialogMode,
  { title: string; subtitle: string }
> = {
  signin: {
    title: "Login",
    subtitle: "Welcome back, login to continue",
  },
  register: {
    title: "Sign Up",
    subtitle: "Create your account to get started",
  },
  "forgot-password": {
    title: "Forgot Password",
    subtitle:
      "Enter your registered email to receive a reset link.",
  },
  "otp-login": {
    title: "Login with OTP",
    subtitle: "We'll email you a one-time code to sign in.",
  },
};
