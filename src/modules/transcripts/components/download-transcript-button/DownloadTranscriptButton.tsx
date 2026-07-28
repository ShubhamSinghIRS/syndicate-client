import DownloadButton from "../../../../components/download-button/DownloadButton";
import { useDownloadTranscript } from "../../hooks/useDownloadTranscript";
import type { Transcript } from "../../types";

type DownloadTranscriptButtonProps = {
  transcript: Pick<Transcript, "id" | "title" | "domain" | "preview">;
};

export default function DownloadTranscriptButton({
  transcript,
}: DownloadTranscriptButtonProps) {
  const { handleDownload } = useDownloadTranscript(transcript);

  return (
    <div className="flex items-center">
      <DownloadButton
        onClick={() =>
          handleDownload().catch((err) =>
            console.error("Download failed:", err),
          )
        }
      />
    </div>
  );
}
