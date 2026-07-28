import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import type { Transcript } from "../../types";
import styles from "./DetailHeader.module.css";

type DetailHeaderProps = {
  transcript: Transcript;
};

export default function DetailHeader({ transcript }: DetailHeaderProps) {
  const allTags = Array.from(
    new Set([transcript.domain, ...transcript.tags]),
  );

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
      <div className="flex items-center gap-2 text-sm text-text-secondary min-w-0">
        <Link
          to={APP_ROUTES.transcripts}
          className="underline hover:no-underline text-text-primary font-medium shrink-0"
        >
          All transcripts
        </Link>
        <span className="shrink-0">/</span>
        <span
          title={transcript.domain}
          className="text-text-primary font-medium truncate max-w-xl"
        >
          {transcript.domain}
        </span>
      </div>

      <div className="mt-2 overflow-hidden pb-1.5 pt-1">
        <div className={styles.marqueeTrack}>
          {renderTags("a")}
          {renderTags("b")}
        </div>
      </div>

      <h1 className="mt-2.5 text-3xl font-bold leading-snug text-text-primary break-words">
        {transcript.title}
      </h1>
    </div>
  );
}
