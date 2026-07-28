import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "../../../../components/tooltip/Tooltip";
import DeleteIcon from "../../../../icons/Delete/Delete";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import type { CartItem } from "../../types";

type CartItemRowProps = {
  item: CartItem;
  onRemove: () => void;
};

export default function CartItem({ item, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-4">
      <div>
        <Link to={APP_ROUTES.transcriptDetail.replace(":id", item.id)}>
          <h3 className="mt-2 font-semibold text-text-primary hover:underline">
            {item.title}
          </h3>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className="text-lg font-semibold text-text-primary">
          ${item.price}
        </span>
        <Tooltip title="Delete" arrow>
          <IconButton
            aria-label="Remove"
            onClick={onRemove}
            sx={{ color: "text.secondary" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
