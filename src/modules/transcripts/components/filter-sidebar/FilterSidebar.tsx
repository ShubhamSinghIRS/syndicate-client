import RadioGroup from "@mui/material/RadioGroup";
import Switch from "@mui/material/Switch";
import CustomRadio from "../../../../components/radio/CustomRadio";
import FilterSection from "./FilterSection";
import DomainAutocomplete from "./DomainAutocomplete";
import { isLoggedIn } from "../../../../utils/authUtils";
import { DEFAULT_SIDEBAR_FILTERS, PUBLISHED_DATE_OPTIONS } from "./constants";
import { buildPriceOptions } from "../../transcriptsService";
import { purchasedOnlySwitchSx } from "./filter-sidebar.styles";
import type {
  FilterBounds,
  PriceFilterValue,
  PublishedDateFilterValue,
  SidebarFilterPayload,
} from "../../types";

type FilterSidebarProps = {
  filters: SidebarFilterPayload;
  setFilters: (filters: SidebarFilterPayload) => void;
  purchasedOnly: boolean;
  setPurchasedOnly: (purchasedOnly: boolean) => void;
  bounds: FilterBounds | null;
};

export default function FilterSidebar({
  filters,
  setFilters,
  purchasedOnly,
  setPurchasedOnly,
  bounds,
}: FilterSidebarProps) {
  const priceOptions = buildPriceOptions(bounds);
  return (
    <div className="w-80 shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-text-primary">Filters</h2>
        <button
          type="button"
          className="text-sm text-accent-2 hover:underline"
          onClick={() => setFilters(DEFAULT_SIDEBAR_FILTERS)}
        >
          Clear all
        </button>
      </div>

      {isLoggedIn() && (
        <div className="mt-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <span className="text-sm font-medium text-text-primary">
            Purchased only
          </span>
          <Switch
            checked={purchasedOnly}
            onChange={(e) => setPurchasedOnly(e.target.checked)}
            sx={purchasedOnlySwitchSx}
          />
        </div>
      )}

      <FilterSection title="Domain">
        <DomainAutocomplete
          selectedDomains={filters.domains}
          setSelectedDomains={(domains) => setFilters({ ...filters, domains })}
        />
      </FilterSection>

      <FilterSection title="Price">
        <RadioGroup
          value={filters.price}
          onChange={(e) =>
            setFilters({
              ...filters,
              price: e.target.value as PriceFilterValue,
            })
          }
        >
          {priceOptions.map((option) => (
            <CustomRadio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      </FilterSection>

      <FilterSection title="Published date">
        <RadioGroup
          value={filters.publishedDate}
          onChange={(e) =>
            setFilters({
              ...filters,
              publishedDate: e.target.value as PublishedDateFilterValue,
            })
          }
        >
          {PUBLISHED_DATE_OPTIONS.map((option) => (
            <CustomRadio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      </FilterSection>
    </div>
  );
}
