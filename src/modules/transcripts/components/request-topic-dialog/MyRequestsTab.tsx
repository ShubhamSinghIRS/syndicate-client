import { useEffect, useState } from "react";
import Button from "../../../../components/button/Button";
import SearchBar from "../../../../components/searchbar/SearchBar";
import { useIsLoggedIn } from "../../../../utils/authUtils";
import { useAuthDialog } from "../../../auth/context/AuthDialogContext";
import { fetchMyTopicRequests } from "./myRequestsService";
import type { TopicRequestItem } from "./myRequestsService";
import TopicRequestDetailsDialog from "./TopicRequestDetailsDialog";
import TopicRequestCardSkeleton from "./TopicRequestCardSkeleton";
import TopicRequestCard from "./TopicRequestCard";

export default function MyRequestsTab() {
  const { openAuthDialog } = useAuthDialog();
  // Reactive - was previously local state only ever set true (on login
  // success), never back to false on logout, so this tab kept showing the
  // logged-in view if the user signed out while it was still mounted.
  const loggedIn = useIsLoggedIn();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<TopicRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TopicRequestItem | null>(
    null,
  );

  useEffect(() => {
    if (!loggedIn) return;

    let isActive = true;
    setIsLoading(true);
    setError(null);

    fetchMyTopicRequests(1, 20, search)
      .then((page) => {
        if (isActive) setItems(page.items);
      })
      .catch(() => {
        if (isActive) setError("Couldn't load your requests.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loggedIn, search]);

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <h3 className="mt-2 text-lg font-bold text-text-primary">
          Login or sign up to see your requests
        </h3>
        <p className="max-w-xs text-sm text-text-secondary">
          To view the status of your topic requests, please login or create
          an account.
        </p>
        <div className="mt-3 flex gap-3">
          <Button
            variant="contained"
            label="Login"
            onClick={() => openAuthDialog("signin")}
          />
          <Button
            variant="outlined"
            label="Sign up"
            onClick={() => openAuthDialog("register")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        placeholder="Search your requests"
        searchValue={search}
        onSearch={setSearch}
        maxWidth="100%"
        height="40px"
      />

      {isLoading && (
        <div className="flex flex-col gap-3">
          <TopicRequestCardSkeleton />
          <TopicRequestCardSkeleton />
          <TopicRequestCardSkeleton />
        </div>
      )}

      {!isLoading && error && (
        <p className="py-6 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p className="py-6 text-center text-sm text-text-secondary">
          {search ? "No matching requests." : "You haven't requested any topics yet."}
        </p>
      )}

      {!isLoading &&
        !error &&
        items.map((item) => (
          <TopicRequestCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}

      <TopicRequestDetailsDialog
        item={selectedItem}
        handleClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
