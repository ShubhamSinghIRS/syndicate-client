import { forwardRef } from "react";
import { Chip as MUIChip } from "@mui/material";
import type { ChipProps as MUIChipProps } from "@mui/material";

export type ChipProps = MUIChipProps;

const Chip = forwardRef<HTMLDivElement, ChipProps>((props, ref) => {
  return <MUIChip ref={ref} {...props} />;
});

export default Chip;
