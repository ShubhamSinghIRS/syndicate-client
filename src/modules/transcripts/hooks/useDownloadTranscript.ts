import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { RequestServerBlob } from "../../../utils/services";
import type { Transcript } from "../types";

const sanitizeFileName = (title: string): string =>
  title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const useDownloadTranscript = (
  transcript: Pick<Transcript, "id" | "title" | "domain" | "preview">,
) => {
  const handleDownload = async () => {
    const blob = await RequestServerBlob(
      `${API_ENDPOINTS.transcriptDownload.replace(":id", transcript.id)}?format=pdf`,
      "Download failed",
    );
    downloadBlob(blob, `${sanitizeFileName(transcript.title)}.pdf`);
  };

  return { handleDownload };
};
