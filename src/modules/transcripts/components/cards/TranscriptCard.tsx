import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../../../components/tooltip/Tooltip";
import Typography from "@mui/material/Typography";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import Button from "../../../../components/button/Button";
import Chip from "../../../../components/chip/Chip";
import CalendarTodayIcon from "../../../../icons/CalendarToday/CalendarToday";
import { useBuyNow } from "../../../checkout/hooks/useBuyNow";
import { useCart } from "../../../cart/hooks/useCart";
import { formatDate } from "../../../../utils/dateUtils";
import CheckIcon from "../../../../icons/Check/Check";
import CheckCircleIcon from "../../../../icons/CheckCircle/CheckCircle";
import { COLORS } from "../../../../constants/colors";
import {
  domainLabelSx,
  domainChipSx,
  cartTooltipSx,
} from "./TranscriptCard.styles";
import type { Transcript } from "../../types";

type TranscriptCardProps = {
  transcript: Transcript;
  isPurchased?: boolean;
};

export default function TranscriptCard({
  transcript,
  isPurchased = false,
}: TranscriptCardProps) {
  const navigate = useNavigate();
  const { items: cartItems, addToCart, removeFromCart } = useCart();
  const handleBuyNow = useBuyNow();
  const isInCart = cartItems.some((item) => item.id === transcript.id);
  const [suppressCartTooltip, setSuppressCartTooltip] = useState(false);

  // Show at most 4 tags; the rest collapse into "+N more".
  const visibleCount = Math.min(4, transcript.tags.length);
  const visibleTags = transcript.tags.slice(0, visibleCount);
  const remainingTags = transcript.tags.slice(visibleCount);
  const remainingTagCount = remainingTags.length;

  const previewText = transcript.preview.endsWith("...")
    ? transcript.preview
    : `${transcript.preview.replace(/\.+$/, "")}...`;

  const goToDetail = () =>
    navigate(APP_ROUTES.transcriptDetail.replace(":id", transcript.id));

  return (
    <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-4.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
          <Typography variant="body2" component="span" sx={domainLabelSx}>
            Domain:
          </Typography>
          {visibleTags.map((tag) => {
            const isLong = tag.length > 40;
            const displayLabel = isLong ? `${tag.slice(0, 40)}...` : tag;
            return (
              <Tooltip key={tag} title={tag} arrow disableHoverListener={!isLong}>
                <Chip
                  label={displayLabel}
                  variant="outlined"
                  size="small"
                  sx={domainChipSx}
                />
              </Tooltip>
            );
          })}
          {remainingTagCount > 0 && (
            <Tooltip title={remainingTags.join(", ")} arrow>
              <Chip
                label={`+${remainingTagCount} more`}
                variant="outlined"
                size="small"
                className="cursor-pointer"
              />
            </Tooltip>
          )}
        </div>
      </div>

      <h2
        onClick={goToDetail}
        className="mt-1.5 text-xl font-bold text-text-primary hover:text-accent-2 transition-colors cursor-pointer"
      >
        {transcript.title}
      </h2>
      <p className="mt-1 text-text-secondary hover:text-text-primary transition-colors line-clamp-2">
        {previewText}
      </p>

      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Tooltip title="Published Date" arrow>
          <span className="flex items-center gap-1 text-sm text-text-secondary cursor-pointer">
            <CalendarTodayIcon fontSize="inherit" />
            {formatDate(transcript.date)}
          </span>
        </Tooltip>
        {isPurchased ? (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
            <CheckCircleIcon fontSize="small" sx={{ color: COLORS.accent2 }} />
            Purchased
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="shrink-0 text-base font-bold text-text-primary">
              USD ${transcript.price}
            </span>
            <Tooltip
              title={isInCart ? "Click to remove from cart" : ""}
              arrow
              disableHoverListener={suppressCartTooltip}
              slotProps={{
                tooltip: {
                  sx: cartTooltipSx,
                },
              }}
            >
              <span onMouseLeave={() => setSuppressCartTooltip(false)} className="shrink-0">
                <Button
                  variant="outlined"
                  label={isInCart ? "In Cart" : "Add to Cart"}
                  startIcon={isInCart ? <CheckIcon fontSize="small" /> : undefined}
                  className="whitespace-nowrap"
                  onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    setSuppressCartTooltip(true);
                    if (isInCart) {
                      removeFromCart(transcript.id);
                    } else {
                      addToCart(transcript);
                    }
                  }}
                />
              </span>
            </Tooltip>
            <Button
              variant="contained"
              label="Buy Transcript"
              className="shrink-0 whitespace-nowrap"
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                handleBuyNow(transcript);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
