import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";
import type {
  AuthResponse,
  PendingAuthResponse,
  RegisterFormValues,
  SignInFormValues,
} from "./types";

export const signIn = async (data: SignInFormValues): Promise<AuthResponse> =>
  RequestServer(API_ENDPOINTS.login, "POST", {
    email: data.workEmail,
    password: data.password,
  });

// Stores the full signup record immediately (including the password) and
// triggers an OTP send. The account exists but is unverified until
// verifyRegistrationOtp succeeds. Identity for the rest of the verification
// flow is carried by the returned pending token, not by resending
// email/password - this is what lets a lapsed OTP be recovered later from
// the sign-in screen (see signIn's 403/pendingToken path) without needing
// the full signup form data again.
export const register = async (
  data: RegisterFormValues,
): Promise<PendingAuthResponse> =>
  RequestServer(API_ENDPOINTS.register, "POST", {
    name: data.fullName,
    email: data.workEmail,
    password: data.password,
    companyName: data.companyName || undefined,
  });

export const verifyRegistrationOtp = async (
  pendingToken: string,
  otp: string,
): Promise<AuthResponse> =>
  RequestServer(API_ENDPOINTS.registerVerifyOtp, "POST", {
    tempToken: pendingToken,
    otp,
  });

export const resendRegistrationOtp = async (
  pendingToken: string,
): Promise<PendingAuthResponse> =>
  RequestServer(API_ENDPOINTS.registerResendOtp, "POST", {
    tempToken: pendingToken,
  });

export const sendLoginOtp = async (
  email: string,
): Promise<PendingAuthResponse> =>
  RequestServer(API_ENDPOINTS.loginOtpSend, "POST", { email });

export const verifyLoginOtp = async (
  pendingToken: string,
  otp: string,
): Promise<AuthResponse> =>
  RequestServer(API_ENDPOINTS.loginOtpVerify, "POST", {
    tempToken: pendingToken,
    otp,
  });

export const sendForgotPasswordLink = async (email: string): Promise<void> =>
  RequestServer(API_ENDPOINTS.forgotPassword, "POST", { email });

export const resetPassword = async (
  token: string,
  password: string,
): Promise<void> =>
  RequestServer(API_ENDPOINTS.resetPassword, "POST", { token, password });
