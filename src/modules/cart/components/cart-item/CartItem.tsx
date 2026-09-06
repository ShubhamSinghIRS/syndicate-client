import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "../../../../components/tooltip/Tooltip";
import Chip from "../../../../components/chip/Chip";
import DeleteIcon from "../../../../icons/Delete/Delete";
import DescriptionIcon from "../../../../icons/Description/Description";
import PublicIcon from "../../../../icons/Public/Public";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import { COLORS } from "../../../../constants/colors";
import type { CartItem } from "../../types";
import type { BackNavigationState } from "../../../transcripts/components/detail/DetailHeader";

type CartItemRowProps = {
  item: CartItem;
  onRemove?: () => void;
  linkState?: BackNavigationState;
};

export default function CartItem({ item, onRemove, linkState }: CartItemRowProps) {
  // Long geography lists are truncated at 5, with the full list in a tooltip.
  const GEOGRAPHY_DISPLAY_LIMIT = 5;
  const countries = item.geography.split(", ").filter(Boolean);
  const isGeographyTruncated = countries.length > GEOGRAPHY_DISPLAY_LIMIT;
  const displayedGeography = isGeographyTruncated
    ? `${countries.slice(0, GEOGRAPHY_DISPLAY_LIMIT).join(", ")}...`
    : item.geography;

  // Same trim-and-tooltip treatment as geography.
  const DOMAIN_DISPLAY_LIMIT = 3;
  const visibleDomains = item.domains.slice(0, DOMAIN_DISPLAY_LIMIT);
  const hiddenDomains = item.domains.slice(DOMAIN_DISPLAY_LIMIT);

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
              {item.title}
            </h3>
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            {visibleDomains.map((domain) => (
              <Chip key={domain} label={domain} variant="outlined" size="small" />
            ))}
            {hiddenDomains.length > 0 && (
              <Tooltip title={hiddenDomains.join(", ")} arrow>
                <Chip
                  label={`+${hiddenDomains.length}`}
                  variant="outlined"
                  size="small"
                  className="cursor-pointer"
                />
              </Tooltip>
            )}
            {isGeographyTruncated ? (
              <Tooltip title={item.geography} arrow>
                <span className="flex items-center gap-1 cursor-pointer">
                  <PublicIcon fontSize="inherit" />
                  {displayedGeography}
                </span>
              </Tooltip>
            ) : (
              <span className="flex items-center gap-1">
                <PublicIcon fontSize="inherit" />
                {displayedGeography}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <span className="text-lg font-bold text-text-primary">
          ${item.price}
        </span>
        {onRemove && (
          <Tooltip title="Remove from Cart" arrow>
            <IconButton
              aria-label="Remove from Cart"
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
          </Tooltip>
        )}
      </div>
    </div>
  );
}
