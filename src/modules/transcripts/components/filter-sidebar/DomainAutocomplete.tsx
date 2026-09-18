import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Checkbox from "../../../../components/checkbox/Checkbox";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import { RequestServer } from "../../../../utils/services";
import { filterByPrefixThenSubstring } from "../../../../utils/autocompleteFilters";
import type { DomainOption } from "../../types";
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
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    RequestServer<DomainOption[]>(API_ENDPOINTS.domains, "GET")
      .then((domains) => setOptions(domains.map((domain) => domain.name)))
      .catch(() => setOptions([]));
  }, []);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      size="small"
      renderTags={(tagValue, getTagProps) => {
        const visibleCount = showAllTags ? tagValue.length : Math.min(tagValue.length, 2);
        const hiddenCount = tagValue.length - visibleCount;
        return (
          <>
            {tagValue.slice(0, visibleCount).map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return <Chip key={key} label={option} {...tagProps} />;
            })}
            {hiddenCount > 0 && (
              <span
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllTags(true);
                }}
                className="cursor-pointer hover:underline"
              >
                +{hiddenCount} more
              </span>
            )}
            {showAllTags && tagValue.length > 2 && (
              <span
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAllTags(false);
                }}
                className="cursor-pointer hover:underline"
              >
                Show less
              </span>
            )}
          </>
        );
      }}
      sx={{ "& .MuiAutocomplete-tag": { maxWidth: "none" } }}
      options={options}
      value={selectedDomains}
      onChange={(_event, value) => setSelectedDomains(value)}
      getOptionLabel={(option) => option}
      filterOptions={(options, { inputValue }) =>
        filterByPrefixThenSubstring(options, inputValue)
      }
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
