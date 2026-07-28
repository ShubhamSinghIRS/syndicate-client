import type { SxProps, Theme } from "@mui/material";

export const purchasedChipSx: SxProps<Theme> = {
  bgcolor: (theme: Theme) =>
    theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.25)" : "#e8f5e9",
  color: (theme: Theme) =>
    theme.palette.mode === "dark" ? "#81c784" : "#2e7d32",
  fontWeight: 600,
  "& .MuiChip-icon": {
    color: (theme: Theme) =>
      theme.palette.mode === "dark" ? "#81c784" : "#2e7d32",
  },
};
