import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import { RequestServer } from "../../../../utils/services";
import { commonInputStyles } from "../../../../common/input-styles";
import type { RequestTopicFormValues } from "./types";

// Shown immediately while the live list loads, and kept as a fallback if
// the request fails - freeSolo still lets people type anything else.
const FALLBACK_DOMAIN_OPTIONS = [
  "Enterprise SaaS",
  "Robotics",
  "Retail",
  "Other",
];

type DomainFieldProps = {
  control: Control<RequestTopicFormValues>;
};

export default function DomainField({ control }: DomainFieldProps) {
  const [options, setOptions] = useState<string[]>(FALLBACK_DOMAIN_OPTIONS);

  useEffect(() => {
    RequestServer<string[]>(API_ENDPOINTS.domains, "GET")
      .then((domains) => {
        setOptions((prev) => Array.from(new Set([...prev, ...domains])));
      })
      .catch(() => {});
  }, []);

  return (
    <Controller
      name="domains"
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <Autocomplete
          multiple
          freeSolo
          disableCloseOnSelect
          size="small"
          options={options}
          value={value}
          onChange={(_event, newValue) => onChange(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              {...commonInputStyles}
              inputRef={ref}
              label="Domain"
              placeholder={value.length ? undefined : "Search or add a domain"}
            />
          )}
        />
      )}
    />
  );
}
