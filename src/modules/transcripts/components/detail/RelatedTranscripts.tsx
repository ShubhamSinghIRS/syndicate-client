import { useEffect, useState } from "react";
import TranscriptCard from "../cards/TranscriptCard";
import { fetchSimilarTranscripts } from "../../transcriptsService";
import type { Transcript } from "../../types";

const RELATED_COUNT = 3;

type RelatedTranscriptsProps = {
  excludeId: string;
  purchasedIds: string[];
};

export default function RelatedTranscripts({
  excludeId,
  purchasedIds,
}: RelatedTranscriptsProps) {
  const [relatedTranscripts, setRelatedTranscripts] = useState<Transcript[]>([]);

  useEffect(() => {
    fetchSimilarTranscripts(excludeId, RELATED_COUNT)
      .then(setRelatedTranscripts)
      .catch(() => setRelatedTranscripts([]));
  }, [excludeId]);

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
