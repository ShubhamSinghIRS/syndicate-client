import Grid from "@mui/material/Grid";
import { HookTextField } from "../form-fields/SLFieldTextField";
import Button from "../button/Button";
import { useHookFormContext } from "../../utils/hooks/useHookFormContext";
import { validRegex } from "../../utils/isValidType";
import { commonInputStyles } from "../../common/input-styles";
import type { SupportFormValues } from "./types";

// Mirrors backend caps (inquiries_schema.py: name<=200, message<=5000).
const NAME_MAX_LENGTH = 200;
const MESSAGE_MAX_LENGTH = 5000;

export default function Fields() {
  const { registerState } = useHookFormContext<SupportFormValues>();

  return (
    <Grid container spacing={2} mt="1px">
      <HookTextField
        {...registerState("name")}
        rules={{
          required: { value: true, message: "This field is required" },
          maxLength: {
            value: NAME_MAX_LENGTH,
            message: `Name must be at most ${NAME_MAX_LENGTH} characters`,
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Your name",
          required: true,
          inputProps: { maxLength: NAME_MAX_LENGTH },
        }}
        gridProps={{ xs: 12 }}
      />
      <HookTextField
        {...registerState("email")}
        rules={{
          required: { value: true, message: "This field is required" },
          pattern: {
            value: validRegex("email"),
            message: "Please enter a correct email",
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Email",
          required: true,
        }}
        gridProps={{ xs: 12 }}
      />
      <HookTextField
        {...registerState("message")}
        rules={{
          required: { value: true, message: "This field is required" },
          maxLength: {
            value: MESSAGE_MAX_LENGTH,
            message: `Message must be at most ${MESSAGE_MAX_LENGTH} characters`,
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "How can we help?",
          required: true,
          multiline: true,
          rows: 4,
          inputProps: { maxLength: MESSAGE_MAX_LENGTH },
        }}
        gridProps={{ xs: 12 }}
      />
      <Grid item xs={12}>
        <Button
          variant="contained"
          label="Send message"
          buttonType="submit"
          styles={{ width: "100%", height: "42px", fontSize: "14px" }}
        />
      </Grid>
    </Grid>
  );
}
