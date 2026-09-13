import Switch from "@mui/material/Switch";
import CustomCheckbox from "../../../../components/checkbox/CustomCheckbox";
import FilterSection from "./FilterSection";
import DomainAutocomplete from "./DomainAutocomplete";
import { useIsLoggedIn } from "../../../../utils/authUtils";
import { DEFAULT_SIDEBAR_FILTERS } from "./constants";
import { purchasedOnlySwitchSx } from "./filter-sidebar.styles";
import type {
  FilterOptions,
  PriceFilterValue,
  PublishedDateFilterValue,
  SidebarFilterPayload,
} from "../../types";

// Toggles a value in/out of an array-valued filter (price, published date).
const toggleValue = <T,>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];

type FilterSidebarProps = {
  filters: SidebarFilterPayload;
  setFilters: (filters: SidebarFilterPayload) => void;
  purchasedOnly: boolean;
  setPurchasedOnly: (purchasedOnly: boolean) => void;
  options: FilterOptions | null;
};

export default function FilterSidebar({
  filters,
  setFilters,
  purchasedOnly,
  setPurchasedOnly,
  options,
}: FilterSidebarProps) {
  const priceOptions = options?.priceOptions ?? [];
  const publishedDateOptions = options?.publishedDateOptions ?? [];
  const loggedIn = useIsLoggedIn();
  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-6 lg:w-80 lg:shrink-0">
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

      {loggedIn && (
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
        <div className="flex flex-col">
          {priceOptions.map((option) => (
            <CustomCheckbox
              key={option.value}
              label={option.label}
              checked={filters.price.includes(option.value)}
              onChange={() =>
                setFilters({
                  ...filters,
                  price: toggleValue<PriceFilterValue>(
                    filters.price,
                    option.value,
                  ),
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Published date">
        <div className="flex flex-col">
          {publishedDateOptions.map((option) => (
            <CustomCheckbox
              key={option.value}
              label={option.label}
              checked={filters.publishedDate.includes(option.value)}
              onChange={() =>
                setFilters({
                  ...filters,
                  publishedDate: toggleValue<PublishedDateFilterValue>(
                    filters.publishedDate,
                    option.value,
                  ),
                })
              }
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
