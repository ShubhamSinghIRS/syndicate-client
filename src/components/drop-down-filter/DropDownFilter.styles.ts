import type { SxProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";

export function getFormControlSx(noMinWidth: boolean): SxProps<Theme> {
  return {
    mx: 1,
    minWidth: noMinWidth ? 0 : 70,
  };
}

export const selectBaseSx: SystemStyleObject<Theme> = {
  fontSize: "0.75rem",
  fontFamily: "inherit",
  fontWeight: "400",
  color: (theme: Theme) => theme.palette.text.secondary,
  padding: "4px 0",
  paddingTop: "6px",
};

export const menuItemSx: SxProps<Theme> = {
  fontSize: "0.75rem",
  fontFamily: "inherit",
  fontWeight: "400",
  color: (theme: Theme) => theme.palette.text.primary,
};
