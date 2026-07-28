import { useState } from "react";
import Tooltip from "../../../../components/tooltip/Tooltip";
import Button from "../../../../components/button/Button";
import CheckIcon from "../../../../icons/Check/Check";

type PurchaseCardProps = {
  price: number;
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onBuyNow: () => void;
};

export default function PurchaseCard({
  price,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
}: PurchaseCardProps) {
  const [suppressCartTooltip, setSuppressCartTooltip] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-6">
      <span className="text-2xl font-bold text-text-primary">USD ${price}</span>

      <div className="mt-4 flex flex-col gap-3">
        <Button variant="contained" label="Buy Transcript" onClick={onBuyNow} />
        <Tooltip
          title={isInCart ? "Click to remove from cart" : ""}
          arrow
          disableHoverListener={suppressCartTooltip}
          slotProps={{
            tooltip: {
              sx: {
                fontSize: "12px",
                borderRadius: "8px",
                px: 1.5,
                py: 0.75,
                maxWidth: "none",
                whiteSpace: "nowrap",
              },
            },
          }}
        >
          <span
            className="block w-full"
            onMouseLeave={() => setSuppressCartTooltip(false)}
          >
            <Button
              variant="outlined"
              label={isInCart ? "In Cart" : "Add to Cart"}
              startIcon={isInCart ? <CheckIcon fontSize="small" /> : undefined}
              onClick={() => {
                setSuppressCartTooltip(true);
                if (isInCart) {
                  onRemoveFromCart();
                } else {
                  onAddToCart();
                }
              }}
              className="w-full"
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
