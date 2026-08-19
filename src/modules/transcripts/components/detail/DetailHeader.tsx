import { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../../../components/back-button/BackButton";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import type { Transcript } from "../../types";
import styles from "./DetailHeader.module.css";

type DetailHeaderProps = {
  transcript: Transcript;
};

// Callers that link here (CartItem, PurchaseHistory, ...) can pass
// { backTo, backLabel } via router state so "Back" returns to wherever the
// user actually came from instead of always landing on the transcripts list.
export type BackNavigationState = {
  backTo?: string;
  backLabel?: string;
};

export default function DetailHeader({ transcript }: DetailHeaderProps) {
  const location = useLocation();
  const { backTo, backLabel } = (location.state as BackNavigationState) ?? {};

  const allTags = Array.from(
    new Set([transcript.domain, ...transcript.tags]),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [needsMarquee, setNeedsMarquee] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const checkOverflow = () => {
      setNeedsMarquee(measure.scrollWidth > container.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [allTags.length]);

  const renderTags = (keyPrefix: string) =>
    allTags.map((tag) => (
      <div
        key={`${keyPrefix}-${tag}`}
        className="inline-flex shrink-0 items-center rounded-full border border-gray-200 dark:border-gray-800 bg-section-background px-2.5 py-1 text-xs font-medium text-text-primary shadow-2xs whitespace-nowrap mr-1.5"
      >
        {tag}
      </div>
    ));

  return (
    <div>
      <BackButton
        label={backLabel ?? "Back To Transcripts"}
        to={backTo ?? APP_ROUTES.transcripts}
      />

      <div ref={containerRef} className="relative mt-2 overflow-hidden pb-1.5 pt-1">
        {/* Invisible single-copy strip used only to detect overflow */}
        <div
          ref={measureRef}
          className="absolute invisible pointer-events-none flex"
          aria-hidden="true"
        >
          {renderTags("measure")}
        </div>

        <div className={needsMarquee ? styles.marqueeTrack : "flex"}>
          {renderTags("a")}
          {needsMarquee && renderTags("b")}
        </div>
      </div>

      <h1 className="mt-2.5 text-3xl font-bold leading-snug text-text-primary break-words">
        {transcript.title}
      </h1>
    </div>
  );
}
