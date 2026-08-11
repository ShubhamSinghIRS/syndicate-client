import { useState } from "react";
import { fetchPurchasedTranscriptsPage, fetchTranscripts } from "../transcriptsService";
import type { Transcript, TranscriptsFilterPayload } from "../types";

export const useTranscripts = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTranscripts = async (payload: TranscriptsFilterPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTranscripts(payload);
      setTranscripts(data.items);
      setTotal(data.total);
    } catch {
      setError("Failed to load transcripts");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPurchasedTranscripts = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPurchasedTranscriptsPage(page, pageSize);
      setTranscripts(data.items);
      setTotal(data.total);
    } catch {
      setError("Failed to load purchased transcripts");
    } finally {
      setIsLoading(false);
    }
  };

  return { transcripts, total, isLoading, error, loadTranscripts, loadPurchasedTranscripts };
};
