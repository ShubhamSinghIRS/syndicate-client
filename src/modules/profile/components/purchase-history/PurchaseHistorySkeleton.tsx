export default function PurchaseHistorySkeleton() {
  return (
    <div className="mt-4 flex flex-col border-t border-gray-200 dark:border-gray-800">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-3 border-b border-gray-100 dark:border-gray-800 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 animate-pulse"
        >
          <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}
