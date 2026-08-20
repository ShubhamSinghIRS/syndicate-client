import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { RequestServerBlob } from "../../../utils/services";

export type PdfStatus = "idle" | "loading" | "ready" | "error";

// Fetches a purchased transcript's actual PDF as a blob from the backend (which
// streams it straight from storage) and exposes a same-origin object URL the
// browser can render inline. Because the bytes come through our own API - not a
// cross-origin storage link - no storage-bucket CORS config is involved, and the
// blob URL renders in an <iframe> with the browser's native PDF viewer.
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
