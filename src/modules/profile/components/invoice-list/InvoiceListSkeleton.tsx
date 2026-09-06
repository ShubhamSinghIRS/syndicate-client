export default function InvoiceListSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 dark:border-gray-800 pt-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-14 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="ml-auto h-8 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}
