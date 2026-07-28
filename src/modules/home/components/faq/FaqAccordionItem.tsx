import ExpandMoreIcon from "../../../../icons/ExpandMore/ExpandMore";
import type { FaqItem } from "../../constants/homeConstants";

type FaqAccordionItemProps = FaqItem & {
  isExpanded: boolean;
  onToggle: () => void;
};

export default function FaqAccordionItem({
  question,
  answer,
  isExpanded,
  onToggle,
}: FaqAccordionItemProps) {
  return (
    <div className="border-b border-[#F2EDE4] dark:border-gray-800 last:border-b-0 py-3.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-4 text-left text-sm sm:text-base font-semibold text-[#2D2B29] dark:text-text-primary hover:text-[#111111] dark:hover:text-text-primary transition-colors cursor-pointer"
      >
        <span>{question}</span>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDF4E7] dark:bg-section-background text-[#C27803] dark:text-accent transition-colors">
          <ExpandMoreIcon
            fontSize="small"
            className={`transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`mt-2.5 text-xs sm:text-sm leading-relaxed text-[#5E5952] dark:text-text-secondary transition-opacity duration-300 ease-in-out ${
              isExpanded ? "opacity-100 delay-100" : "opacity-0"
            }`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
