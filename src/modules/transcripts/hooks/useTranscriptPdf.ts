import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { RequestServerBlob } from "../../../utils/services";

export type PdfStatus = "idle" | "loading" | "ready" | "error";

// Fetches the PDF as a blob from our own API and exposes an object URL for an <iframe>.
export const useTranscriptPdf = (
  id: string | undefined,
  enabled: boolean,
): { url: string | null; status: PdfStatus } => {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<PdfStatus>("idle");

  useEffect(() => {
    if (!id || !enabled) {
      setUrl(null);
      setStatus("idle");
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;
    setStatus("loading");
    setUrl(null);

    RequestServerBlob(
      API_ENDPOINTS.transcriptView.replace(":id", id),
      "Failed to load transcript",
    )
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    // Revoke the object URL on unmount / id change so we don't leak blobs.
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, enabled]);

  return { url, status };
};
