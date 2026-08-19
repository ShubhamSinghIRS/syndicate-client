import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "../../../../icons/Delete/Delete";
import DescriptionIcon from "../../../../icons/Description/Description";
import CalendarTodayIcon from "../../../../icons/CalendarToday/CalendarToday";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import { COLORS } from "../../../../constants/colors";
import { formatDate } from "../../../../utils/dateUtils";
import type { CartItem } from "../../types";
import type { BackNavigationState } from "../../../transcripts/components/detail/DetailHeader";

type CartItemRowProps = {
  item: CartItem;
  onRemove?: () => void;
  // Lets the detail page's "Back" button return here instead of defaulting
  // to the transcripts list, since this card shows up on more than one page.
  linkState?: BackNavigationState;
};

export default function CartItem({ item, onRemove, linkState }: CartItemRowProps) {
  // Mock/seed data sometimes bakes the transcript's own id into its title
  // (e.g. "... (#954)") - drop it from display since the id is already
  // shown as its own tag below.
  const idSuffix = ` (#${item.id})`;
  const title = item.title.endsWith(idSuffix)
    ? item.title.slice(0, -idSuffix.length)
    : item.title;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-main-background p-4 transition-shadow duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/15">
          <DescriptionIcon style={{ color: COLORS.accent2 }} />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            to={APP_ROUTES.transcriptDetail.replace(":id", item.id)}
            state={linkState}
          >
            <h3 className="truncate font-semibold text-text-primary hover:text-accent-2 transition-colors">
              {title}
            </h3>
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <span>{item.geography}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <CalendarTodayIcon fontSize="inherit" />
              {formatDate(item.date)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <span className="text-lg font-bold text-text-primary">
          ${item.price}
        </span>
        {onRemove && (
          <div className="flex flex-col items-center gap-0.5">
            <IconButton
              aria-label="Remove"
              onClick={onRemove}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px",
                color: "text.secondary",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <span className="text-[11px] text-text-secondary">Remove</span>
          </div>
        )}
      </div>
    </div>
  );
}
