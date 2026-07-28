import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";
import { DEFAULT_SIDEBAR_FILTERS } from "./components/filter-sidebar/constants";
import type {
  SidebarFilterPayload,
  Transcript,
  TranscriptsApiResponse,
  TranscriptsFilterPayload,
} from "./types";

// Builds the query for GET /api/transcripts, omitting default filters.
export const buildTranscriptsFilterPayload = (
  search: string,
  filters: SidebarFilterPayload,
  page: number,
  pageSize: number,
): TranscriptsFilterPayload => {
  const payload: TranscriptsFilterPayload = { page, pageSize, sort_by: "-date" };
  if (search) payload.search = search;
  if (filters.domains.length) payload.in___domain = filters.domains.join(",");
  if (filters.price !== DEFAULT_SIDEBAR_FILTERS.price) payload.price = filters.price;
  if (filters.publishedDate !== DEFAULT_SIDEBAR_FILTERS.publishedDate) {
    payload.publishedDate = filters.publishedDate;
  }
  return payload;
};

export const fetchTranscripts = async (
  payload: TranscriptsFilterPayload,
): Promise<TranscriptsApiResponse> => {
  const params = new URLSearchParams();
  params.set("page", String(payload.page));
  params.set("pageSize", String(payload.pageSize));
  if (payload.search) params.set("search", payload.search);
  if (payload.in___domain) params.set("in___domain", payload.in___domain);
  if (payload.price) params.set("price", payload.price);
  if (payload.publishedDate) params.set("publishedDate", payload.publishedDate);

  return RequestServer(`${API_ENDPOINTS.transcripts}?${params}`, "GET");
};

export const fetchTranscriptById = async (id: string): Promise<Transcript> =>
  RequestServer(API_ENDPOINTS.transcriptDetail.replace(":id", id), "GET");
