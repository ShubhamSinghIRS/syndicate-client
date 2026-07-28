import type { CSSProperties } from "react";
import { COLORS } from "../../constants/colors";

export function getButtonStyle(
  variant: string,
  disabled?: boolean,
): CSSProperties {
  const isOutlinedAccent = variant === "outlined-accent";
  const isOutlined = variant === "outlined" || isOutlinedAccent;

  return {
    border: isOutlinedAccent
      ? `1px solid ${COLORS.accent2}`
      : variant === "outlined"
        ? "1px solid var(--color-text-secondary)"
        : "none",
    color: isOutlinedAccent
      ? COLORS.accent2
      : variant === "outlined"
        ? "var(--color-text-primary)"
        : "white",
    fontSize: "13px",
    borderRadius: "9999px",
    textTransform: "capitalize",
    height: "36px",
    padding: "0 20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: isOutlined ? "transparent" : COLORS.accent2,
    boxShadow: "none",
    fontFamily: "inherit",
    opacity: disabled ? "0.4" : "initial",
    fontWeight: 500,
  };
}
