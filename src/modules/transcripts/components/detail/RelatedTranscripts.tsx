import { useEffect, useRef, useState } from "react";
import TranscriptCard from "../cards/TranscriptCard";
import TranscriptCardSkeleton from "../cards/TranscriptCardSkeleton";
import { fetchSimilarTranscripts } from "../../transcriptsService";
import type { Transcript } from "../../types";
import ExpandLessIcon from "../../../../icons/ExpandLess/ExpandLess";
import ExpandMoreIcon from "../../../../icons/ExpandMore/ExpandMore";

const RELATED_COUNT = 10;
const SCROLL_STEP = 160;

type RelatedTranscriptsProps = {
  excludeId: string;
  purchasedIds: string[];
};

export default function RelatedTranscripts({
  excludeId,
  purchasedIds,
}: RelatedTranscriptsProps) {
  const [relatedTranscripts, setRelatedTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchSimilarTranscripts(excludeId, RELATED_COUNT)
      .then((data) => {
        if (active) {
          setRelatedTranscripts(data);
        }
      })
      .catch(() => {
        if (active) {
          setRelatedTranscripts([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [excludeId]);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ top: amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">
            Similar transcripts
          </h2>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <TranscriptCardSkeleton />
          <TranscriptCardSkeleton />
          <TranscriptCardSkeleton />
        </div>
      </div>
    );
  }

  if (relatedTranscripts.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">
          Similar transcripts
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Scroll up"
            onClick={() => scrollBy(-SCROLL_STEP)}
            className="rounded-full border border-gray-200 p-1 text-text-secondary hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ExpandLessIcon fontSize="small" />
          </button>
          <button
            type="button"
            aria-label="Scroll down"
            onClick={() => scrollBy(SCROLL_STEP)}
            className="rounded-full border border-gray-200 p-1 text-text-secondary hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ExpandMoreIcon fontSize="small" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="mt-4 flex max-h-112 flex-col gap-4 overflow-y-auto pr-1"
      >
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
