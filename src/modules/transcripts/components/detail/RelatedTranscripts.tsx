import { useEffect, useMemo } from "react";
import TranscriptCard from "../cards/TranscriptCard";
import { useTranscripts } from "../../hooks/useTranscripts";

const RELATED_COUNT = 3;

type RelatedTranscriptsProps = {
  domain: string;
  excludeId: string;
  purchasedIds: string[];
};

export default function RelatedTranscripts({
  domain,
  excludeId,
  purchasedIds,
}: RelatedTranscriptsProps) {
  const { transcripts, loadTranscripts } = useTranscripts();

  useEffect(() => {
    loadTranscripts({
      page: 1,
      pageSize: RELATED_COUNT + 1,
      domain: [domain],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  const relatedTranscripts = useMemo(
    () =>
      transcripts
        .filter((t) => t.domain === domain && t.id !== excludeId)
        .slice(0, RELATED_COUNT),
    [transcripts, domain, excludeId],
  );

  if (relatedTranscripts.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-text-primary">
        Similar transcripts
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {relatedTranscripts.map((transcript) => (
          <TranscriptCard
            key={transcript.id}
            transcript={transcript}
            isPurchased={purchasedIds.includes(transcript.id)}
          />
        ))}
      </div>
    </div>
  );
}
