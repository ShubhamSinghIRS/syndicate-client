export default function CartItemSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-main-background p-4 animate-pulse sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-2 h-3 w-32 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <div className="h-5 w-12 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-9 w-9 rounded-[10px] bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}
