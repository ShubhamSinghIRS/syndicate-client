// Formats an ISO date string into a short display date, e.g. "Jul 20, 2026".
export const formatDate = (date: string | undefined | null): string => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
