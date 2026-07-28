import type { SxProps, Theme } from "@mui/material";
import { COLORS } from "../../constants/colors";

type PaperSxParams = {
  m?: { xs: string; sm: string };
  p?: string;
  submitButtonVariant: "default" | "orange-circle";
  height: string;
  borderRadius: string;
  backgroundColor: string;
  boxShadow: string;
  maxWidth?: string;
  minWidth?: string | { xs: string; sm: string; md: string; lg: string };
};

export function getPaperSx({
  m,
  p,
  submitButtonVariant,
  height,
  borderRadius,
  backgroundColor,
  boxShadow,
  maxWidth,
  minWidth,
}: PaperSxParams): SxProps<Theme> {
  return {
    m: m || {
      xs: "0.75rem 0",
      sm: "0 1rem",
    },
    p:
      p ||
      (submitButtonVariant === "orange-circle"
        ? height === "56px"
          ? "6px 8px 6px 20px"
          : "4px 6px 4px 16px"
        : "5px 12px"),
    paddingRight: "6px",
    display: "flex",
    alignItems: "center",
    borderRadius: borderRadius,
    backgroundColor: backgroundColor,
    border: "1px solid var(--color-section-background)",
    boxShadow: boxShadow,
    maxWidth: maxWidth || "500px",
    minWidth: minWidth || {
      xs: "200px",
      sm: "200px",
      md: "250px",
      lg: "400px",
    },
    height: height,
  };
}

export function getInputBaseSx(inputFontSize: string): SxProps<Theme> {
  return {
    ml: 0,
    flex: 1,
    fontSize: inputFontSize,
    fontWeight: "500",
    pl: "10px",
    "&::-webkit-search-clear-button": {
      display: "none",
    },
    "&::-webkit-search-cancel-button": {
      display: "none",
    },
  };
}

export function getOrangeCircleButtonSx(height: string): SxProps<Theme> {
  return {
    padding: height === "56px" ? "10px" : "8px",
    backgroundColor: COLORS.accent2,
    color: COLORS.mainBackground,
    "&:hover": {
      backgroundColor: "#d8811d",
    },
    width: height === "56px" ? "40px" : "32px",
    height: height === "56px" ? "40px" : "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

export function getOrangeSendIconSx(height: string): SxProps<Theme> {
  return {
    fontSize: height === "56px" ? "20px" : "16px",
    color: COLORS.mainBackground,
  };
}
