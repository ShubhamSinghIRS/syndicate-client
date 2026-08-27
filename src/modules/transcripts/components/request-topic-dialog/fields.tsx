import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "../../../../components/tooltip/Tooltip";
import { HookTextField } from "../../../../components/form-fields/SLFieldTextField";
import FormCancelSubmitBtns from "../../../../components/form-cancel-submit-btns/FormCancelSubmitBtns";
import { useHookFormContext } from "../../../../utils/hooks/useHookFormContext";
import { validRegex } from "../../../../utils/isValidType";
import { commonInputStyles } from "../../../../common/input-styles";
import InfoOutlined from "../../../../icons/InfoOutlined/InfoOutlined";
import ExpandMoreIcon from "../../../../icons/ExpandMore/ExpandMore";
import DeleteIcon from "../../../../icons/Delete/Delete";
import DomainField from "./DomainField";
import type { RequestTopicFormValues } from "./types";

const TOPIC_MAX_LENGTH = 300;
const REMARK_MAX_LENGTH = 2000;

type FieldsProps = {
  handleClose: () => void;
  showEmail: boolean;
};

export default function Fields({ handleClose, showEmail }: FieldsProps) {
  const { registerState, control, formState } =
    useHookFormContext<RequestTopicFormValues>();
  const topicValue = useWatch({ control, name: "topic" }) ?? "";
  const remarkValue = useWatch({ control, name: "remark" }) ?? "";
  const [showExpertFields, setShowExpertFields] = useState(false);
  const {
    fields: expertFields,
    append: appendExpert,
    remove: removeExpert,
  } = useFieldArray({ control, name: "suggestedExperts" });

  const handleToggleExpertFields = () => {
    if (!showExpertFields && expertFields.length === 0) {
      appendExpert({ name: "", linkedin: "" });
    }
    setShowExpertFields((prev) => !prev);
  };

  return (
    <Grid container spacing={2} mt="1px">
      <HookTextField
        {...registerState("topic")}
        rules={{
          required: { value: true, message: "This field is required" },
          maxLength: {
            value: TOPIC_MAX_LENGTH,
            message: `Topic must be at most ${TOPIC_MAX_LENGTH} characters`,
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Topic",
          placeholder: "What insight are you looking for?",
          required: true,
          inputProps: {
            maxLength: TOPIC_MAX_LENGTH,
            style: { paddingRight: 56 },
          },
          InputProps: {
            endAdornment: (
              <span className="pointer-events-none absolute bottom-0.5 right-3 text-[10px] text-text-secondary">
                {topicValue.length}/{TOPIC_MAX_LENGTH}
              </span>
            ),
          },
          sx: { "& .MuiOutlinedInput-root": { position: "relative" } },
          helperText: formState.errors.topic?.message ?? "",
        }}
        gridProps={{ xs: 12 }}
      />
      <Grid item xs={12}>
        <DomainField control={control} />
      </Grid>
      {showEmail && (
        <HookTextField
          {...registerState("email")}
          rules={{
            pattern: {
              value: validRegex("email"),
              message: "Please enter a correct email",
            },
          }}
          textFieldProps={{
            ...commonInputStyles,
            label: "Email",
            placeholder: "So we can notify you when it's ready",
          }}
          gridProps={{ xs: 12 }}
        />
      )}
      <HookTextField
        {...registerState("remark")}
        rules={{
          maxLength: {
            value: REMARK_MAX_LENGTH,
            message: `Remark must be at most ${REMARK_MAX_LENGTH} characters`,
          },
        }}
        textFieldProps={{
          ...commonInputStyles,
          label: "Remark",
          placeholder: "Any additional notes",
          multiline: true,
          minRows: 2,
          inputProps: {
            maxLength: REMARK_MAX_LENGTH,
            style: { paddingBottom: 14 },
          },
          InputProps: {
            endAdornment: (
              <span className="pointer-events-none absolute bottom-3 right-3 text-[10px] text-text-secondary">
                {remarkValue.length}/{REMARK_MAX_LENGTH}
              </span>
            ),
          },
          sx: { "& .MuiOutlinedInput-root": { position: "relative" } },
          helperText: formState.errors.remark?.message ?? "",
        }}
        gridProps={{ xs: 12 }}
      />

      <Grid item xs={12} sx={{ pt: "8px !important", pb: "0px !important" }}>
        <button
          type="button"
          onClick={handleToggleExpertFields}
          aria-expanded={showExpertFields}
          className="flex w-full items-center justify-between gap-1 text-left cursor-pointer"
        >
          <span className="flex items-center gap-1 text-sm font-medium text-text-primary">
            Recommend an expert
            <Tooltip title="Share a name or LinkedIn if there's someone specific you'd like us to approach to get the transcript">
              <IconButton
                size="small"
                sx={{ color: "inherit", p: 0.5 }}
                onClick={(event) => event.stopPropagation()}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </span>
          <ExpandMoreIcon
            fontSize="small"
            className={`text-text-secondary transition-transform duration-200 ${
              showExpertFields ? "rotate-180" : ""
            }`}
          />
        </button>
      </Grid>
      {showExpertFields && (
        <Grid
          item
          xs={12}
          sx={{ pt: "8px !important", display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {expertFields.map((expertField, index) => (
            <div key={expertField.id} className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-text-primary">
                Expert {index + 1}
              </p>
              <div className="flex items-start gap-2">
                <HookTextField
                  {...registerState(`suggestedExperts.${index}.name`)}
                  textFieldProps={{
                    ...commonInputStyles,
                    placeholder: "Expert name",
                  }}
                />
                <HookTextField
                  {...registerState(`suggestedExperts.${index}.linkedin`)}
                  textFieldProps={{
                    ...commonInputStyles,
                    placeholder: "LinkedIn profile URL",
                  }}
                />
                <Tooltip title="Remove expert">
                  <IconButton
                    size="small"
                    aria-label="Remove expert"
                    onClick={() => removeExpert(index)}
                    sx={{ mt: "4px" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendExpert({ name: "", linkedin: "" })}
            className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 py-2 text-sm font-medium text-text-primary hover:bg-section-background cursor-pointer"
          >
            <AddIcon fontSize="small" />
            Add another expert
          </button>
        </Grid>
      )}

      <FormCancelSubmitBtns handleClose={handleClose} submitLabel="Request" />
    </Grid>
  );
}
