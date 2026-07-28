export default function TranscriptCardSkeleton() {
  return (
    <div className="relative rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-4.5 animate-pulse">
      {/* Domain/Tags line */}
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>

      {/* Title */}
      <div className="mt-3 h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

      {/* Description lines */}
      <div className="mt-2.5 space-y-1.5">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Bottom line */}
      <div className="mt-4.5 flex items-center justify-between">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-8 w-28 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
