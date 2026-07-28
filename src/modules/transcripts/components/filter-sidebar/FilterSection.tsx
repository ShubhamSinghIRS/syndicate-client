import { useState } from "react";
import type { ReactNode } from "react";
import ExpandMoreIcon from "../../../../icons/ExpandMore/ExpandMore";
import ExpandLessIcon from "../../../../icons/ExpandLess/ExpandLess";

type FilterSectionProps = {
  title: string;
  children: ReactNode;
};

export default function FilterSection({ title, children }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm font-semibold text-text-primary"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {title}
        {isExpanded ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );
}
