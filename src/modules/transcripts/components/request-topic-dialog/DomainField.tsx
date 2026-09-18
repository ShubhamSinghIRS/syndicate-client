import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import { RequestServer } from "../../../../utils/services";
import { commonInputStyles } from "../../../../common/input-styles";
import { filterByPrefixThenSubstring } from "../../../../utils/autocompleteFilters";
import type { RequestTopicFormValues } from "./types";
import type { DomainOption } from "../../types";
import { MIN_DOMAINS, MAX_DOMAINS, DOMAIN_MAX_LENGTH } from "../../constants";

type DomainFieldProps = {
  control: Control<RequestTopicFormValues>;
};

export default function DomainField({ control }: DomainFieldProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    RequestServer<DomainOption[]>(API_ENDPOINTS.domains, "GET")
      .then((domains) => setOptions(domains.map((domain) => domain.name)))
      .catch(() => {});
  }, []);

  return (
    <Controller
      name="domains"
      control={control}
      rules={{
        validate: (value) => {
          if (value.length < MIN_DOMAINS) {
            return `Please add at least ${MIN_DOMAINS} domains`;
          }
          if (value.length > MAX_DOMAINS) {
            return `You can add at most ${MAX_DOMAINS} domains`;
          }
          return true;
        },
      }}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          freeSolo
          disableCloseOnSelect
          size="small"
          options={options}
          value={value}
          filterOptions={(opts, { inputValue }) =>
            filterByPrefixThenSubstring(opts, inputValue)
          }
          onChange={(_event, newValue) => onChange(newValue.slice(0, MAX_DOMAINS))}
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
              error={!!error}
              helperText={error?.message}
              inputProps={{ ...params.inputProps, maxLength: DOMAIN_MAX_LENGTH }}
            />
          )}
        />
      )}
    />
  );
}
