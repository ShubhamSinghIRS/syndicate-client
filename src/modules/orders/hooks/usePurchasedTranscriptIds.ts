import { useEffect, useState } from "react";
import { AUTH_CHANGED_EVENT, isLoggedIn } from "../../../utils/authUtils";
import { fetchPurchasedTranscriptIds } from "../../transcripts/transcriptsService";

export const usePurchasedTranscriptIds = (): string[] => {
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      if (!isLoggedIn()) {
        setPurchasedIds([]);
        return;
      }

      fetchPurchasedTranscriptIds()
        .then(setPurchasedIds)
        .catch(() => setPurchasedIds([]));
    };

    load();

    // Login happens in a dialog without a page reload, so this component may
    // already be mounted (and have cached "logged out") by the time it succeeds.
    window.addEventListener(AUTH_CHANGED_EVENT, load);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, load);
  }, []);

  return purchasedIds;
};
