import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";

export type Profile = {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
  accessTokenExpiresIn: number;
};

export const fetchProfile = async (): Promise<Profile> =>
  RequestServer(API_ENDPOINTS.profile, "GET");
