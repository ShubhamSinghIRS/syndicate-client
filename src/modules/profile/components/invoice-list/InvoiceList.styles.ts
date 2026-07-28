import type { SxProps, Theme } from "@mui/material";

export const paidChipSx: SxProps<Theme> = {
  backgroundColor: (theme: Theme) =>
    theme.palette.mode === "dark" ? "rgba(21, 128, 61, 0.25)" : "#DCFCE7",
  color: (theme: Theme) =>
    theme.palette.mode === "dark" ? "#4ade80" : "#15803D",
  fontWeight: 600,
};
