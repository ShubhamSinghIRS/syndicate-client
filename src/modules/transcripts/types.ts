export type Expert = {
  name: string;
  title: string;
  company: string;
  yearsOfExperience: number;
  email: string;
  linkedinUrl: string;
};

export type Transcript = {
  id: string;
  title: string;
  domain: string;
  tags: string[];
  preview: string;
  price: number;
  readMinutes: number;
  date: string;
  geography: string;
  coverageHighlights: string[];
  expert: Expert;
};

export type PriceFilterValue =
  "all" | "free" | "under-100" | "100-250" | "over-250";

export type PublishedDateFilterValue =
  "any time" | "last-week" | "last-month" | "last-3-months" | "last-year";

export type SidebarFilterPayload = {
  domains: string[];
  price: PriceFilterValue;
  publishedDate: PublishedDateFilterValue;
};

// Body payload for POST /api/transcripts/filter.
export type TranscriptsFilterPayload = {
  page: number;
  pageSize: number;
  domains?: string[];
  // General text search (topic, preview, domain, geography) - what the main
  // search bar sends.
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  publishedAfter?: string;
};

export type TranscriptsApiResponse = {
  items: Transcript[];
  total: number;
  page: number;
  pageSize: number;
};

// GET /api/transcripts/filter-bounds - min/max price and published date
// across active transcripts, used to size the price/date filter options
// with real numbers instead of guessed ones.
export type FilterBounds = {
  minPrice: number | null;
  maxPrice: number | null;
  minPublishedAt: string | null;
  maxPublishedAt: string | null;
};
