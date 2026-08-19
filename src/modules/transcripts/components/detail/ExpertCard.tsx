import type { Expert } from "../../types";

type ExpertCardProps = {
  expert: Expert;
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-6">
      <p className="text-sm font-semibold text-text-primary">
        About the Expert
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-base font-semibold text-white">
          {getInitials(expert.name)}
        </div>
        <div>
          <p className="font-semibold text-text-primary">{expert.name}</p>
          <p className="text-sm text-text-secondary">
            {expert.title} at {expert.company}
          </p>
        </div>
      </div>
    </div>
  );
}
