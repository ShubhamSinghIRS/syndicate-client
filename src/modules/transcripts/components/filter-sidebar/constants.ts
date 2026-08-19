import type {
  PublishedDateFilterValue,
  SidebarFilterPayload,
} from "../../types";

export const PUBLISHED_DATE_OPTIONS: {
  label: string;
  value: PublishedDateFilterValue;
}[] = [
  { label: "Any time", value: "any time" },
  { label: "Past week", value: "last-week" },
  { label: "Past month", value: "last-month" },
  { label: "Past 3 months", value: "last-3-months" },
  { label: "Past year", value: "last-year" },
];

export const DEFAULT_SIDEBAR_FILTERS: SidebarFilterPayload = {
  domains: [],
  price: "all",
  publishedDate: "any time",
};
