export type AuthDialogMode =
  | "signin"
  | "register"
  | "forgot-password"
  | "otp-login";

export type SignInFormValues = {
  workEmail: string;
  password: string;
};

export type RegisterFormValues = {
  fullName: string;
  workEmail: string;
  companyName: string;
  password: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type LoginOtpFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type RegisterOtpFormValues = {
  otp: string;
};

export type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    companyName?: string | null;
  };
  // Seconds until the access token (httpOnly cookie) expires; used to schedule a refresh.
  accessTokenExpiresIn: number;
};

export type PendingAuthResponse = {
  tempToken: string;
};

export type PasswordRequirement = {
  label: string;
  test: (value: string) => boolean;
};
