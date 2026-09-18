import { useState } from "react";
import type { TopicRequestItem } from "../../../transcripts/components/request-topic-dialog/myRequestsService";
import TopicRequestDetailsDialog from "../../../transcripts/components/request-topic-dialog/TopicRequestDetailsDialog";
import TopicRequestCardSkeleton from "../../../transcripts/components/request-topic-dialog/TopicRequestCardSkeleton";
import TopicRequestCard from "../../../transcripts/components/request-topic-dialog/TopicRequestCard";

type RequestedTopicsProps = {
  items: TopicRequestItem[];
  isLoading?: boolean;
};

export default function RequestedTopics({ items, isLoading = false }: RequestedTopicsProps) {
  const [selectedItem, setSelectedItem] = useState<TopicRequestItem | null>(
    null,
  );

  return (
    <div className="h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-xl font-bold text-text-primary">Requested Topics</h2>


      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 dark:border-gray-800 pt-4">
          <TopicRequestCardSkeleton />
          <TopicRequestCardSkeleton />
          <TopicRequestCardSkeleton />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
          <p className="text-text-secondary">
            You haven't requested any topics yet.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex max-h-[600px] flex-col gap-3 overflow-y-auto border-t border-gray-200 dark:border-gray-800 pt-4 pr-2">
          {items.map((item) => (
            <TopicRequestCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}

      <TopicRequestDetailsDialog
        item={selectedItem}
        handleClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
