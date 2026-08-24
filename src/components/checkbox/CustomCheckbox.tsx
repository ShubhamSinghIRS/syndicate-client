import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "./Checkbox";
import { COLORS } from "../../constants/colors";

type CustomCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function CustomCheckbox({
  label,
  checked,
  onChange,
}: CustomCheckboxProps) {
  return (
    <FormControlLabel
      className="mr-8"
      label={label}
      control={
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          sx={{ "&.Mui-checked": { color: COLORS.accent2 } }}
        />
      }
    />
  );
}
