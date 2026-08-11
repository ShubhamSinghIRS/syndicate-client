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

type DomainAutocompleteProps = {
  selectedDomains: string[];
  setSelectedDomains: (domains: string[]) => void;
};

export default function DomainAutocomplete({
  selectedDomains,
  setSelectedDomains,
}: DomainAutocompleteProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    RequestServer<string[]>(API_ENDPOINTS.domains, "GET")
      .then(setOptions)
      .catch(() => setOptions([]));
  }, []);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      size="small"
      limitTags={2}
      getLimitTagsText={(more) => `+${more} more`}
      options={options}
      value={selectedDomains}
      onChange={(_event, value) => setSelectedDomains(value)}
      getOptionLabel={(option) => option}
      filterOptions={(options, { inputValue }) => {
        const inputValueLowercased = inputValue.toLowerCase();
        return options.filter((option) =>
          option.toLowerCase().includes(inputValueLowercased),
        );
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option}>
          <Checkbox checked={selected} sx={domainCheckboxSx} />
          <span className="flex-1">{option}</span>
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
