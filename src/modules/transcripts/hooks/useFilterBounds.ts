import { useEffect, useState } from "react";
import { fetchFilterBounds } from "../transcriptsService";
import type { FilterBounds } from "../types";

// Fetched once and reused for the lifetime of the filter sidebar - these
// bounds only change as transcripts are published/priced, not per-render.
// null while loading (or on failure); callers fall back to reasonable
// static breakpoints in that case, see priceBreakpoints in transcriptsService.
export const useFilterBounds = (): FilterBounds | null => {
  const [bounds, setBounds] = useState<FilterBounds | null>(null);

  useEffect(() => {
    fetchFilterBounds()
      .then(setBounds)
      .catch(() => setBounds(null));
  }, []);

  return bounds;
};
