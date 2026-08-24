import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";
import type {
  FilterBounds,
  PriceFilterValue,
  PublishedDateFilterValue,
  SidebarFilterPayload,
  Transcript,
  TranscriptsApiResponse,
  TranscriptsFilterPayload,
} from "./types";

// Shape actually returned by the backend (see TranscriptListItem /
// TranscriptDetailResponse in transcripts_schema.py) - kept separate from
// the frontend's own `Transcript` type so the rest of the app doesn't have
// to change when the API shape does; mapTranscript() is the only place that
// translates between the two.
export type RawExpert = {
  id: number;
  name: string | null;
  designation: string | null;
};

export type RawTranscript = {
  id: string | number;
  topic: string | null;
  domains: string[];
  geographies: string[];
  preview: string | null;
  keyInsights: string[];
  publishedAt: string | null;
  price: number;
  expert: RawExpert | null;
};

type RawPage<T> = {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export const mapTranscript = (raw: RawTranscript): Transcript => ({
  id: String(raw.id),
  title: raw.topic ?? "Untitled",
  domain: raw.domains[0] ?? "",
  tags: raw.domains,
  preview: raw.preview ?? "",
  price: raw.price,
  readMinutes: 5,
  date: raw.publishedAt ?? "",
  geography: raw.geographies.join(", "),
  coverageHighlights: raw.keyInsights,
  expert: {
    name: raw.expert?.name ?? "Unknown",
    title: raw.expert?.designation ?? "",
    company: "",
    yearsOfExperience: 0,
    email: "",
    linkedinUrl: "",
  },
});

// Splits the live [minPrice, maxPrice] (from GET /api/transcripts/filter-bounds)
// into two round-number breakpoints, so the "under X" / "X - Y" / "over Y"
// buckets track real data instead of guessed $100/$250 thresholds. Falls back
// to those same guessed numbers while bounds haven't loaded yet (`null`),
// so the filter never looks broken/empty in the meantime.
const priceBreakpoints = (bounds: FilterBounds | null): { low: number; high: number } => {
  const min = bounds?.minPrice ?? 0;
  const max = bounds?.maxPrice ?? 250;
  if (max <= min) return { low: 100, high: 250 };
  const round10 = (n: number) => Math.round(n / 10) * 10;
  const low = Math.max(min, round10(min + (max - min) / 3));
  const high = Math.max(low + 10, round10(min + ((max - min) * 2) / 3));
  return { low, high };
};

// price bucket -> TranscriptFilterRequest's minPrice/maxPrice range.
const buildPriceRanges = (
  bounds: FilterBounds | null,
): Record<PriceFilterValue, { minPrice?: number; maxPrice?: number }> => {
  const { low, high } = priceBreakpoints(bounds);
  return {
    free: { minPrice: 0, maxPrice: 0 },
    "under-100": { maxPrice: low - 1 },
    "100-250": { minPrice: low, maxPrice: high },
    "over-250": { minPrice: high + 1 },
  };
};

// Labels for the price checkboxes - the bucket identifiers (e.g. "under-100")
// are just internal ids (also used in the URL's ?price= param) and don't need
// to match the displayed number, which comes from priceBreakpoints instead.
export const buildPriceOptions = (
  bounds: FilterBounds | null,
): { label: string; value: PriceFilterValue }[] => {
  const { low, high } = priceBreakpoints(bounds);
  return [
    { label: "Free", value: "free" },
    { label: `Under $${low}`, value: "under-100" },
    { label: `$${low} - $${high}`, value: "100-250" },
    { label: `Over $${high}`, value: "over-250" },
  ];
};

export const fetchFilterBounds = async (): Promise<FilterBounds> =>
  RequestServer<FilterBounds>(API_ENDPOINTS.filterBounds, "GET");

// published-date bucket -> number of days back from now to filter from.
const PUBLISHED_DATE_DAYS: Record<PublishedDateFilterValue, number> = {
  "last-week": 7,
  "last-month": 30,
  "last-3-months": 90,
  "last-year": 365,
};

// The backend only takes a single minPrice/maxPrice pair, but the price
// filter now allows picking several buckets at once, so multiple selections
// are unioned into one range spanning the lowest min to the highest max.
// Non-adjacent picks (e.g. "Free" + "Over $250") will also pull in the
// buckets between them - an accepted approximation given the single-range
// backend contract.
const unionPriceRange = (
  selected: PriceFilterValue[],
  bounds: FilterBounds | null,
): { minPrice?: number; maxPrice?: number } => {
  const ranges = selected.map((value) => buildPriceRanges(bounds)[value]);
  const minPrice = Math.min(...ranges.map((range) => range.minPrice ?? 0));
  const maxes = ranges.map((range) => range.maxPrice);
  const maxPrice = maxes.every((max) => max !== undefined)
    ? Math.max(...(maxes as number[]))
    : undefined;
  return maxPrice === undefined ? { minPrice } : { minPrice, maxPrice };
};

// Builds the body for POST /api/transcripts/filter, omitting default filters.
export const buildTranscriptsFilterPayload = (
  search: string,
  filters: SidebarFilterPayload,
  page: number,
  pageSize: number,
  bounds: FilterBounds | null,
): TranscriptsFilterPayload => {
  const payload: TranscriptsFilterPayload = { page, pageSize };
  if (search) payload.search = search;
  if (filters.domains.length) payload.domains = filters.domains;
  if (filters.price.length) {
    Object.assign(payload, unionPriceRange(filters.price, bounds));
  }
  if (filters.publishedDate.length) {
    // Published-date buckets are nested (last-week ⊂ last-year), so the
    // widest selected bucket alone covers the union of all selected ones.
    const days = Math.max(
      ...filters.publishedDate.map((value) => PUBLISHED_DATE_DAYS[value]),
    );
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    payload.publishedAfter = cutoff.toISOString();
  }
  return payload;
};

export const fetchTranscripts = async (
  payload: TranscriptsFilterPayload,
): Promise<TranscriptsApiResponse> => {
  const raw = await RequestServer<RawPage<RawTranscript>>(
    API_ENDPOINTS.transcriptsFilter,
    "POST",
    {
      page: payload.page,
      limit: payload.pageSize,
      domains: payload.domains,
      search: payload.search,
      minPrice: payload.minPrice,
      maxPrice: payload.maxPrice,
      publishedAfter: payload.publishedAfter,
    },
  );
  return {
    items: raw.items.map(mapTranscript),
    total: raw.meta.total,
    page: raw.meta.page,
    pageSize: raw.meta.limit,
  };
};

export const fetchTranscriptById = async (id: string): Promise<Transcript> => {
  const raw = await RequestServer<RawTranscript>(
    API_ENDPOINTS.transcriptDetail.replace(":id", id),
    "GET",
  );
  return mapTranscript(raw);
};

// Backend ranks by domain overlap first, then preview-text relevance, so
// nothing extra needs to be filtered client-side.
export const fetchSimilarTranscripts = async (
  id: string,
  limit: number,
): Promise<Transcript[]> => {
  const raw = await RequestServer<RawTranscript[]>(
    `${API_ENDPOINTS.transcriptSimilar.replace(":id", id)}?limit=${limit}`,
    "GET",
  );
  return raw.map(mapTranscript);
};

// Entitlement-backed, not order-backed - includes admin-granted access, not
// just paid purchases. Loops to completion rather than reading one page,
// since a truncated result would wrongly treat an owned item past the first
// page as not-yet-purchased. The requested limit here is just a hint - the
// backend is the real enforcement (a client-side cap would be pointless,
// anyone can call the API directly with any value) - so completion is
// checked against the accumulated count, not `page * requestedLimit`,
// which stays correct no matter what the server actually enforces.
const fetchAllPurchasedPages = async <T>(
  mapItem: (raw: RawTranscript) => T,
): Promise<T[]> => {
  const limit = 20;
  let page = 1;
  const items: T[] = [];

  while (true) {
    const raw = await RequestServer<RawPage<RawTranscript>>(
      `${API_ENDPOINTS.myPurchased}?page=${page}&limit=${limit}`,
      "GET",
    );
    items.push(...raw.items.map(mapItem));
    if (items.length >= raw.meta.total || raw.items.length === 0) break;
    page += 1;
  }

  return items;
};

export const fetchPurchasedTranscriptIds = (): Promise<string[]> =>
  fetchAllPurchasedPages((item) => String(item.id));

// Same purchased-transcripts source as fetchPurchasedTranscriptIds, but keeps
// full transcript details - used to build order/invoice rows without an
// extra per-transcript fetch (and without a client-side filter for "is this
// order actually still valid" - myPurchased already excludes revoked access).
export const fetchAllPurchasedTranscripts = (): Promise<Transcript[]> =>
  fetchAllPurchasedPages(mapTranscript);

// Backs the "Purchased only" toggle - a real page from GET
// /api/transcripts/me/purchased, not a client-side filter of whatever page
// of the general listing happens to be loaded (which would miss purchased
// items outside that page).
export const fetchPurchasedTranscriptsPage = async (
  page: number,
  pageSize: number,
): Promise<TranscriptsApiResponse> => {
  const raw = await RequestServer<RawPage<RawTranscript>>(
    `${API_ENDPOINTS.myPurchased}?page=${page}&limit=${pageSize}`,
    "GET",
  );
  return {
    items: raw.items.map(mapTranscript),
    total: raw.meta.total,
    page: raw.meta.page,
    pageSize: raw.meta.limit,
  };
};
