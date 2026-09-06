export default function TopicRequestCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-section-background p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-16 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-3 h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
