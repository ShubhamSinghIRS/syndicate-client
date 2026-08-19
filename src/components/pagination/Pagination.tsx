import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const MAX_VISIBLE_PAGES = 5;

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
  let end = start + MAX_VISIBLE_PAGES - 1;

  if (end > totalPages) {
    end = totalPages;
    start = end - MAX_VISIBLE_PAGES + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const PaginationComponent = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);
  const showLeadingEllipsis = visiblePages[0] > 1;
  const showTrailingEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const navButtonClass = (disabled: boolean) =>
    `flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      disabled
        ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
        : "text-text-secondary hover:bg-[#FAF7F2] dark:hover:bg-gray-800 cursor-pointer"
    }`;

  return (
    <div className="mx-auto flex w-fit items-center gap-1 rounded-xl border border-[#ECE8DF] dark:border-gray-800 bg-white dark:bg-main-background p-1.5">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
        className={navButtonClass(page <= 1)}
      >
        <ChevronLeftIcon fontSize="small" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {showLeadingEllipsis && (
        <span className="px-2 text-sm text-text-secondary">...</span>
      )}

      {visiblePages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={
            p === page
              ? "flex h-8 w-8 items-center justify-center rounded-lg border-2 border-text-primary text-sm font-semibold text-text-primary"
              : "flex h-8 w-8 items-center justify-center rounded-lg text-sm text-text-secondary hover:bg-[#FAF7F2] dark:hover:bg-gray-800 cursor-pointer"
          }
        >
          {p}
        </button>
      ))}

      {showTrailingEllipsis && (
        <span className="px-2 text-sm text-text-secondary">...</span>
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
        className={navButtonClass(page >= totalPages)}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon fontSize="small" />
      </button>
    </div>
  );
};

export default PaginationComponent;
