import { useEffect, useState } from "react";
import { fetchFilterOptions } from "../transcriptsService";
import type { FilterOptions } from "../types";

// Fetched once and reused for the sidebar's lifetime; null while loading or on failure.
export const useFilterOptions = (): FilterOptions | null => {
  const [options, setOptions] = useState<FilterOptions | null>(null);

  useEffect(() => {
    fetchFilterOptions()
      .then(setOptions)
      .catch(() => setOptions(null));
  }, []);

  return options;
};
