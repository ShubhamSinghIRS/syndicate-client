import type { SxProps, Theme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";

export const domainCheckboxSx: SxProps<Theme> = {
  "&.Mui-checked": { color: COLORS.accent2 },
};

export const domainTextFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: COLORS.accent2,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: COLORS.accent2,
    },
  },
  // Tags wrap and grow the input's height; MUI's default endAdornment
  // is vertically centered on the whole box, which lands it mid-stack
  // once there are enough chips. Pin it to the top-right instead.
  "& .MuiAutocomplete-endAdornment": {
    top: "9px",
    transform: "none",
  },
};

export const purchasedOnlySwitchSx: SxProps<Theme> = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: COLORS.accent2 },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: COLORS.accent2,
  },
};
