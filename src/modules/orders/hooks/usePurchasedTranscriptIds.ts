import { useEffect, useState } from "react";
import { AUTH_CHANGED_EVENT, isLoggedIn } from "../../../utils/authUtils";
import { fetchPurchasedTranscriptIds } from "../../transcripts/transcriptsService";

type PurchasedTranscriptIds = {
  purchasedIds: string[];
  // True until the first fetch settles, so callers can avoid treating "not yet loaded" as "not owned".
  isLoading: boolean;
};

export const usePurchasedTranscriptIds = (): PurchasedTranscriptIds => {
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      if (!isLoggedIn()) {
        setPurchasedIds([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      fetchPurchasedTranscriptIds()
        .then(setPurchasedIds)
        .catch(() => setPurchasedIds([]))
        .finally(() => setIsLoading(false));
    };

    load();

    // Login happens without a page reload, so a mounted component may have a stale "logged out".
    window.addEventListener(AUTH_CHANGED_EVENT, load);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, load);
  }, []);

  return { purchasedIds, isLoading };
};
