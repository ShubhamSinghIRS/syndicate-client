import { formatDate } from "../../../../utils/dateUtils";
import { TOPIC_REQUEST_STATUS_DISPLAY } from "../../../transcripts/components/request-topic-dialog/myRequestsService";
import type { TopicRequestItem } from "../../../transcripts/components/request-topic-dialog/myRequestsService";

type RequestedTopicsProps = {
  items: TopicRequestItem[];
};

export default function RequestedTopics({ items }: RequestedTopicsProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h2 className="text-xl font-bold text-text-primary">Requested Topics</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Topics you've asked us to source
      </p>

      {items.length === 0 ? (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
          <p className="text-text-secondary">
            You haven't requested any topics yet.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex max-h-[600px] flex-col gap-3 overflow-y-auto border-t border-gray-200 dark:border-gray-800 pt-4 pr-2">
          {items.map((item) => {
            const statusDisplay = TOPIC_REQUEST_STATUS_DISPLAY[item.status];
            return (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-section-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4
                    className="line-clamp-2 min-w-0 break-words font-semibold text-text-primary"
                    title={item.topic}
                  >
                    {item.topic}
                  </h4>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${statusDisplay.className}`}
                  >
                    {statusDisplay.label}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 break-words text-sm text-text-secondary">
                  {item.domains.join(", ")}
                </p>
                <p className="mt-2 text-xs text-text-secondary">
                  Requested on {formatDate(item.createdAt)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
