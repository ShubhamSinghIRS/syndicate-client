import type {
  AuthDialogMode,
  ForgotPasswordFormValues,
  LoginOtpFormValues,
  PasswordRequirement,
  RegisterFormValues,
  RegisterOtpFormValues,
  ResetPasswordFormValues,
  SignInFormValues,
} from "./types";

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

// How long a user must wait before requesting another OTP.
export const OTP_RESEND_SECONDS = 60;

// Mirrors the backend's hard caps (auth_schema.py / auth_validator.py).
export const FULL_NAME_MAX_LENGTH = 200;
export const COMPANY_NAME_MAX_LENGTH = 500;
export const PASSWORD_MAX_LENGTH = 72;

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "8+ characters", test: (value) => value.length >= 8 },
  { label: "uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "number", test: (value) => /\d/.test(value) },
  { label: "special character", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export const SIGN_IN_DEFAULT_VALUES: SignInFormValues = {
  workEmail: "",
  password: "",
};

export const REGISTER_DEFAULT_VALUES: RegisterFormValues = {
  fullName: "",
  workEmail: "",
  companyName: "",
  password: "",
};

export const FORGOT_PASSWORD_DEFAULT_VALUES: ForgotPasswordFormValues = {
  email: "",
};

export const REGISTER_OTP_DEFAULT_VALUES: RegisterOtpFormValues = {
  otp: "",
};

export const LOGIN_OTP_DEFAULT_VALUES: LoginOtpFormValues = {
  email: "",
};

export const RESET_PASSWORD_DEFAULT_VALUES: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};
