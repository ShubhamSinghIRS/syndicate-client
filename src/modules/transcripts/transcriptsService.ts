import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";
import type {
  PriceFilterValue,
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
export type RawAuthor = {
  id: number;
  name: string | null;
  designation: string | null;
};

export type RawTranscript = {
  id: number;
  topic: string | null;
  domain: string[];
  geography: string[];
  preview: string | null;
  keyInsight: string[];
  publishedAt: string | null;
  approvedAt: string | null;
  price: number;
  author: RawAuthor | null;
};

type RawPage<T> = {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export const mapTranscript = (raw: RawTranscript): Transcript => ({
  id: String(raw.id),
  title: raw.topic ?? "Untitled",
  domain: raw.domain[0] ?? "",
  tags: raw.domain,
  preview: raw.preview ?? "",
  price: raw.price,
  readMinutes: 5,
  date: raw.publishedAt ?? raw.approvedAt ?? "",
  geography: raw.geography.join(", "),
  coverageHighlights: raw.keyInsight,
  author: {
    name: raw.author?.name ?? "Unknown",
    title: raw.author?.designation ?? "",
    company: "",
    yearsOfExperience: 0,
    email: "",
    linkedinUrl: "",
  },
});

// price bucket -> TranscriptFilterRequest's minPrice/maxPrice range.
const PRICE_RANGES: Record<
  Exclude<PriceFilterValue, "all">,
  { minPrice?: number; maxPrice?: number }
> = {
  free: { minPrice: 0, maxPrice: 0 },
  "under-100": { maxPrice: 99 },
  "100-250": { minPrice: 100, maxPrice: 250 },
  "over-250": { minPrice: 251 },
};

// Builds the body for POST /api/transcripts/filter, omitting default filters.
export const buildTranscriptsFilterPayload = (
  search: string,
  filters: SidebarFilterPayload,
  page: number,
  pageSize: number,
): TranscriptsFilterPayload => {
  const payload: TranscriptsFilterPayload = { page, pageSize };
  if (search) payload.search = search;
  if (filters.domains.length) payload.domain = filters.domains;
  if (filters.price !== "all") {
    Object.assign(payload, PRICE_RANGES[filters.price]);
  }
  // publishedDate filtering isn't implemented server-side yet.
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
      domain: payload.domain,
      search: payload.search,
      minPrice: payload.minPrice,
      maxPrice: payload.maxPrice,
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

// Entitlement-backed, not order-backed - includes admin-granted access, not
// just paid purchases. Loops to completion (max page size is 100) rather
// than reading one page, since a truncated result would wrongly treat an
// owned item past the first page as not-yet-purchased.
export const fetchPurchasedTranscriptIds = async (): Promise<string[]> => {
  const limit = 100;
  let page = 1;
  const ids: string[] = [];

  while (true) {
    const raw = await RequestServer<RawPage<RawTranscript>>(
      `${API_ENDPOINTS.myPurchased}?page=${page}&limit=${limit}`,
      "GET",
    );
    ids.push(...raw.items.map((item) => String(item.id)));
    if (page * limit >= raw.meta.total) break;
    page += 1;
  }

  return ids;
};

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
