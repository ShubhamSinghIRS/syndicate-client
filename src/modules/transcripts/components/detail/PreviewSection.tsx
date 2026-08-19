import Tooltip from "../../../../components/tooltip/Tooltip";
import Chip from "../../../../components/chip/Chip";
import LockOutlinedIcon from "../../../../icons/LockOutlined/LockOutlined";
import CalendarTodayIcon from "../../../../icons/CalendarToday/CalendarToday";
import PublicIcon from "../../../../icons/Public/Public";
import CheckCircleIcon from "../../../../icons/CheckCircle/CheckCircle";
import Button from "../../../../components/button/Button";
import DownloadTranscriptButton from "../download-transcript-button/DownloadTranscriptButton";
import { formatDate } from "../../../../utils/dateUtils";
import { LOCKED_PREVIEW_PARAGRAPHS } from "../../pages/constants";
import { COLORS } from "../../../../constants/colors";
import { purchasedChipSx } from "./PreviewSection.styles";
import type { Transcript } from "../../types";

type PreviewSectionProps = {
  preview: string;
  date: string;
  geography: string;
  coverageHighlights: string[];
  onBuyClick: () => void;
  isPurchased: boolean;
  fullText: string | null;
  transcript: Pick<Transcript, "id" | "title" | "domain" | "preview">;
};

export default function PreviewSection({
  preview,
  date,
  geography,
  coverageHighlights,
  onBuyClick,
  isPurchased,
  fullText,
  transcript,
}: PreviewSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-lg font-bold text-text-primary">Preview</h2>
      <p className="mt-3 text-text-secondary">{preview}</p>

      {coverageHighlights.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-text-primary">
            Key Insights:
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {coverageHighlights.map((highlight, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <CheckCircleIcon
                  fontSize="small"
                  sx={{ color: COLORS.accent2 }}
                />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3.5 border-t border-gray-200 dark:border-gray-800 pt-4 text-sm text-text-secondary">
        <Tooltip title="Published Date" arrow>
          <span className="flex items-center gap-1 cursor-pointer">
            <CalendarTodayIcon fontSize="small" />
            <span>{formatDate(date)}</span>
          </span>
        </Tooltip>
        <span>·</span>
        <Tooltip title="Geographies the insights are most relevant to" arrow>
          <span className="flex items-center gap-1 cursor-pointer">
            <PublicIcon fontSize="small" />
            <span>{geography}</span>
          </span>
        </Tooltip>
      </div>

      {isPurchased ? (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-text-primary">
                Full transcript
              </h3>
              <Chip
                label="Purchased"
                icon={<CheckCircleIcon fontSize="small" />}
                size="small"
                sx={purchasedChipSx}
              />
            </div>
            <DownloadTranscriptButton transcript={transcript} />
          </div>
          <div className="mt-3 max-h-[700px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-800 bg-section-background p-6 shadow-inner">
            <div className="space-y-3">
              {fullText === null ? (
                <p className="text-text-secondary">Loading full transcript…</p>
              ) : (
                fullText
                  .split("\n")
                  .filter((line) => line.trim().length > 0)
                  .map((line, index) => (
                    <p key={index} className="text-text-secondary">
                      {line}
                    </p>
                  ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mt-4">
          <div aria-hidden className="select-none space-y-3 blur-[4px]">
            {LOCKED_PREVIEW_PARAGRAPHS.map((paragraph, index) => (
              <p key={index} className="text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-main-background via-main-background/90 to-transparent">
            <LockOutlinedIcon sx={{ color: COLORS.accent2 }} />
            <Button
              variant="contained"
              label="Buy Transcript"
              onClick={onBuyClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
