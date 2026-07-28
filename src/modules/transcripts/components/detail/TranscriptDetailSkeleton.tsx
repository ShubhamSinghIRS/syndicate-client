import Header from "../../../../components/header/Header";
import Footer from "../../../../components/footer/Footer";

export default function TranscriptDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-6 py-10 animate-pulse">
          {/* Header Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="h-9 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              {/* Preview Box Skeleton */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6 space-y-4">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex gap-4">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>

              {/* Related list Skeleton */}
              <div className="space-y-4">
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                  <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6 space-y-4 animate-pulse">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6 space-y-4 animate-pulse">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
