// A plain substring filter ranks matches in whatever order the source list
// happens to have, so a prefix match ("Information Technology") can lose to
// a mid-string match ("Student Information Systems") if that one came first
// in the list. This ranks prefix matches ahead of other substring matches.
export function filterByPrefixThenSubstring(
  options: string[],
  query: string,
): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return options;

  const prefixMatches: string[] = [];
  const substringMatches: string[] = [];
  for (const option of options) {
    const lower = option.toLowerCase();
    if (lower.startsWith(trimmed)) {
      prefixMatches.push(option);
    } else if (lower.includes(trimmed)) {
      substringMatches.push(option);
    }
  }
  return [...prefixMatches, ...substringMatches];
}
