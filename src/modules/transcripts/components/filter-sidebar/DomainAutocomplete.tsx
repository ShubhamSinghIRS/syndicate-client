import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "../../../../components/checkbox/Checkbox";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import { RequestServer } from "../../../../utils/services";
import {
  domainCheckboxSx,
  domainTextFieldSx,
} from "./filter-sidebar.styles";

type DomainOption = { label: string; value: string; count: number };

type DomainAutocompleteProps = {
  selectedDomains: string[];
  setSelectedDomains: (domains: string[]) => void;
};

export default function DomainAutocomplete({
  selectedDomains,
  setSelectedDomains,
}: DomainAutocompleteProps) {
  const [options, setOptions] = useState<DomainOption[]>([]);

  useEffect(() => {
    RequestServer<DomainOption[]>(API_ENDPOINTS.domains, "GET")
      .then(setOptions)
      .catch(() => setOptions([]));
  }, []);

  const selectedOptions = selectedDomains.map(
    (domain) =>
      options.find((option) => option.value === domain) ?? {
        label: domain,
        value: domain,
        count: 0,
      },
  );

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      size="small"
      limitTags={2}
      getLimitTagsText={(more) => `+${more} more`}
      options={options}
      value={selectedOptions}
      onChange={(_event, value) =>
        setSelectedDomains(value.map((option) => option.value))
      }
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      filterOptions={(options, { inputValue }) => {
        const inputValueLowercased = inputValue.toLowerCase();
        return options.filter((option) =>
          option.label.toLowerCase().includes(inputValueLowercased),
        );
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.value}>
          <Checkbox checked={selected} sx={domainCheckboxSx} />
          <span className="flex-1">{option.label}</span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search domains"
          sx={domainTextFieldSx}
        />
      )}
    />
  );
}
