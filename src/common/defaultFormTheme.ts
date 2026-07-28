import type { PaletteMode } from "@mui/material";
import { COLORS } from "../constants/colors";

export const getDefaultFormTheme = (mode: PaletteMode) => ({
  typography: {
    fontFamily: [
      "Montserrat",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(", "),
    fontSize: 12,
  },
  palette: {
    mode,
    primary: {
      main: COLORS.accent2,
    },
    ...(mode === "dark"
      ? {
          background: {
            default: "#0a0a0a",
            paper: "#121212",
          },
          text: {
            primary: "#f3f4f6",
            secondary: "#a3a3a3",
          },
        }
      : {
          background: {
            default: COLORS.mainBackground,
            paper: COLORS.mainBackground,
          },
          text: {
            primary: COLORS.textPrimary,
            secondary: COLORS.textSecondary,
          },
        }),
  },
});
