import { useState } from "react";
import FaqAccordionItem from "./FaqAccordionItem";
import { FAQ_ITEMS } from "../../constants/homeConstants";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div id="faq" className="w-full bg-[#FAF7F2] dark:bg-layout-background py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#23211F] dark:text-text-primary sm:text-4xl tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-2.5 text-base text-[#78736B] dark:text-text-secondary max-w-xl mx-auto">
            Everything you need to know about buying and using session transcripts.
          </p>
        </div>

        <div className="mx-auto max-w-4xl mt-10 rounded-2xl border border-[#ECE8DF] dark:border-gray-800 bg-white dark:bg-main-background px-5 sm:px-8 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          {FAQ_ITEMS.map((item, index) => (
            <FaqAccordionItem
              key={item.question}
              {...item}
              isExpanded={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? null : index))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
