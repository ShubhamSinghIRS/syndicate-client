import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";
import type {
  AuthResponse,
  RegisterFormValues,
  SignInFormValues,
} from "./types";

export const signIn = async (data: SignInFormValues): Promise<AuthResponse> =>
  RequestServer(API_ENDPOINTS.login, "POST", {
    email: data.workEmail,
    password: data.password,
  });

export const register = async (
  data: RegisterFormValues,
  otp: string,
): Promise<AuthResponse> =>
  RequestServer(API_ENDPOINTS.register, "POST", {
    name: data.fullName,
    email: data.workEmail,
    password: data.password,
    companyName: data.companyName || undefined,
    otp,
  });

export const sendForgotPasswordLink = async (email: string): Promise<void> =>
  RequestServer(API_ENDPOINTS.forgotPassword, "POST", { email });

export const sendRegisterOtp = async (email: string): Promise<void> =>
  RequestServer(API_ENDPOINTS.registerOtpSend, "POST", { email });
