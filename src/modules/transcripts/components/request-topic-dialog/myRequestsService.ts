import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import { RequestServer } from "../../../../utils/services";

export type TopicRequestStatus = "open" | "in_progress" | "resolved" | "rejected";

export type RawTopicRequestItem = {
  id: number;
  topic: string | null;
  domain: string;
  status: TopicRequestStatus;
  createdAt: string | null;
};

export type TopicRequestItem = {
  id: number;
  topic: string;
  domain: string;
  status: TopicRequestStatus;
  createdAt: string | null;
};

type RawPage<T> = {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type TopicRequestsPage = {
  items: TopicRequestItem[];
  total: number;
  page: number;
  limit: number;
};

// Backend only tracks open/in_progress/resolved/rejected - "Live" here means
// the requested topic was fulfilled, "In review" covers both open states.
export const TOPIC_REQUEST_STATUS_DISPLAY: Record<
  TopicRequestStatus,
  { label: string; className: string }
> = {
  open: {
    label: "In review",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  in_progress: {
    label: "In review",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  resolved: {
    label: "Live",
    className:
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
  rejected: {
    label: "Closed",
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
};

export const fetchMyTopicRequests = async (
  page: number,
  limit: number,
  search: string,
): Promise<TopicRequestsPage> => {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) query.set("search", search);

  const raw = await RequestServer<RawPage<RawTopicRequestItem>>(
    `${API_ENDPOINTS.myTopicRequests}?${query.toString()}`,
    "GET",
  );

  return {
    items: raw.items.map((item) => ({ ...item, topic: item.topic ?? "" })),
    total: raw.meta.total,
    page: raw.meta.page,
    limit: raw.meta.limit,
  };
};
