import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useTranscripts } from "../hooks/useTranscripts";
import { usePurchasedTranscriptIds } from "../../orders/hooks/usePurchasedTranscriptIds";
import { buildTranscriptsFilterPayload } from "../transcriptsService";
import TranscriptCard from "../components/cards/TranscriptCard";
import TranscriptCardSkeleton from "../components/cards/TranscriptCardSkeleton";
import FilterSidebar from "../components/filter-sidebar/FilterSidebar";
import Button from "../../../components/button/Button";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import PaginationComponent from "../../../components/pagination/Pagination";
import RequestTopicDialog from "../components/request-topic-dialog";
import WarningDialog from "../../../components/form-close-warning/WarningDialog";
import { useBoolean } from "../../../utils/hooks/useBoolean";
import { DEFAULT_SIDEBAR_FILTERS } from "../components/filter-sidebar/constants";
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from "./constants";
import type {
  PriceFilterValue,
  PublishedDateFilterValue,
  SidebarFilterPayload,
} from "../types";

const SEARCH_DEBOUNCE_MS = 300;

export default function TranscriptsList() {
  const { transcripts, total, isLoading, error, loadTranscripts } =
    useTranscripts();
  const purchasedIds = usePurchasedTranscriptIds();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilterPayload>(
    () => ({
      domains:
        searchParams.get("domains")?.split(",").filter(Boolean) ??
        DEFAULT_SIDEBAR_FILTERS.domains,
      price:
        (searchParams.get("price") as PriceFilterValue | null) ??
        DEFAULT_SIDEBAR_FILTERS.price,
      publishedDate:
        (searchParams.get("publishedDate") as PublishedDateFilterValue | null) ??
        DEFAULT_SIDEBAR_FILTERS.publishedDate,
    }),
  );
  const [purchasedOnly, setPurchasedOnly] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("pageSize")) || PAGE_SIZE,
  );
  const {
    value: isRequestTopicOpen,
    setTrue: openRequestTopic,
    setFalse: closeRequestTopic,
  } = useBoolean();
  const {
    value: isRequestTopicChanged,
    setTrue: setRequestTopicChanged,
    setFalse: resetRequestTopicChanged,
  } = useBoolean();
  const {
    value: isWarningOpen,
    setTrue: openWarning,
    setFalse: closeWarning,
  } = useBoolean();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSidebarFilters(DEFAULT_SIDEBAR_FILTERS);
    setPage(1);
  };

  const handleRequestTopicClose = () => {
    if (isRequestTopicChanged) {
      openWarning();
    } else {
      closeRequestTopic();
    }
  };

  const handleDiscardChanges = () => {
    closeWarning();
    resetRequestTopicChanged();
    closeRequestTopic();
  };

  const handleRequestTopicSubmitted = () => {
    resetRequestTopicChanged();
    closeRequestTopic();
  };

  // Debounced so typing doesn't fire a network request per keystroke now
  // that search runs server-side instead of filtering an in-memory array.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.q = search;
    if (sidebarFilters.domains.length) {
      params.domains = sidebarFilters.domains.join(",");
    }
    if (sidebarFilters.price !== DEFAULT_SIDEBAR_FILTERS.price) {
      params.price = sidebarFilters.price;
    }
    if (sidebarFilters.publishedDate !== DEFAULT_SIDEBAR_FILTERS.publishedDate) {
      params.publishedDate = sidebarFilters.publishedDate;
    }
    if (page !== 1) params.page = String(page);
    if (pageSize !== PAGE_SIZE) params.pageSize = String(pageSize);
    setSearchParams(params, { replace: true });
  }, [search, sidebarFilters, page, pageSize, setSearchParams]);

  useEffect(() => {
    loadTranscripts(
      buildTranscriptsFilterPayload(debouncedSearch, sidebarFilters, page, pageSize),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sidebarFilters, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visibleTranscripts = purchasedOnly
    ? transcripts.filter((transcript) => purchasedIds.includes(transcript.id))
    : transcripts;

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        isSearch
        searchPlaceholder="Search topics, domains, or keywords..."
        searchValue={search}
        onSearch={handleSearchChange}
        isExtraComponent
        component={
          <Button
            variant="outlined"
            label="Can't find it ? Request A Topic"
            onClick={openRequestTopic}
            styles={{
              fontWeight: 500,
              fontSize: "13px",
              height: "36px",
              borderRadius: "9999px",
              whiteSpace: "nowrap",
            }}
          />
        }
      />

      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-6 py-10">
          <div className="flex gap-8">
            <FilterSidebar
              filters={sidebarFilters}
              setFilters={(filters) => {
                setSidebarFilters(filters);
                setPage(1);
              }}
              purchasedOnly={purchasedOnly}
              setPurchasedOnly={setPurchasedOnly}
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-primary">
                All transcripts
              </h1>

              {isLoading ? (
                <div className="mt-4 flex flex-col gap-3 pr-2">
                  <TranscriptCardSkeleton />
                  <TranscriptCardSkeleton />
                  <TranscriptCardSkeleton />
                </div>
              ) : error ? (
                <p className="mt-4">{error}</p>
              ) : visibleTranscripts.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-lg font-semibold text-text-primary">
                    {purchasedOnly
                      ? "No purchased transcripts "
                      : "No results found."}
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex max-h-[960px] flex-col gap-3 overflow-y-scroll pr-2">
                  {visibleTranscripts.map((transcript) => (
                    <TranscriptCard
                      key={transcript.id}
                      transcript={transcript}
                      isPurchased={purchasedIds.includes(transcript.id)}
                    />
                  ))}
                </div>
              )}

              {total > 0 && !purchasedOnly && (
                <div className="mt-8">
                  <PaginationComponent
                    page={page}
                    totalPages={totalPages}
                    totalResult={total}
                    paginationHandler={(_e, value) => setPage(value)}
                    dropdownFilterProps={{
                      setFilterPayload: (value) => {
                        setPageSize(Number(value));
                        setPage(1);
                      },
                      dropDownItems: PAGE_SIZE_OPTIONS.map((size) => ({
                        label: size,
                        value: size.toString(),
                      })),
                      filterValue: pageSize.toString(),
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <RequestTopicDialog
            isOpen={isRequestTopicOpen}
            handleClose={handleRequestTopicClose}
            handleFormChange={setRequestTopicChanged}
            handleSubmitClose={handleRequestTopicSubmitted}
          />
          <WarningDialog
            open={isWarningOpen}
            handleClose={closeWarning}
            handleYesClick={handleDiscardChanges}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
