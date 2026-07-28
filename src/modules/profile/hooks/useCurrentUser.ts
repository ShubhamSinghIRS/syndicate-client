import { getStorageItem } from "../../../utils/storageUtils";

// Sourced from JWT claims cached at sign-in (see authUtils.processToken).
export const useCurrentUser = () => {
  return {
    userId: getStorageItem<string>("userId"),
    userName: getStorageItem<string>("userName"),
    email: getStorageItem<string>("email"),
    companyName: getStorageItem<string>("companyName"),
  };
};
