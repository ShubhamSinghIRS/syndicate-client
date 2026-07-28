import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { getDefaultFormTheme } from "../common/defaultFormTheme";

export const getAppTheme = (mode: PaletteMode) =>
  createTheme(getDefaultFormTheme(mode));
