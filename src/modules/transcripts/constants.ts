// Ids are either the legacy plain-number form or the backend's UUID form.
export const TRANSCRIPT_ID_PATTERN =
  /^(\d+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export const SEARCH_DEBOUNCE_MS = 300;

export const RELATED_COUNT = 10;
export const SCROLL_STEP = 160;

export const TOPIC_MAX_LENGTH = 300;
export const REMARK_MAX_LENGTH = 2000;
// Per-entry caps; combined length is enforced again in form.tsx.
export const EXPERT_NAME_MAX_LENGTH = 200;
export const EXPERT_LINKEDIN_MAX_LENGTH = 500;

export const MIN_DOMAINS = 2;
export const MAX_DOMAINS = 200;
export const DOMAIN_MAX_LENGTH = 100;

// Remarks can run long - collapse past this length behind a "Show more" toggle.
export const REMARK_PREVIEW_LENGTH = 200;

export const PAGE_SIZE = 20;

export const LOCKED_PREVIEW_PARAGRAPHS = [
  "The rest of this conversation covers the specific numbers authors rarely share publicly: budget ranges, vendor names, and the internal pushback that shaped the final decision.",
  "It also gets into what did not work, the assumptions that had to be abandoned midway, and the metric the team now tracks instead of the one they started with.",
];
