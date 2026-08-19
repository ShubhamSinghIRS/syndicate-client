import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "../../../../components/button/Button";
import EmailOutlinedIcon from "../../../../icons/EmailOutlined/EmailOutlined";
import { isLoggedIn } from "../../../../utils/authUtils";
import { formatDate } from "../../../../utils/dateUtils";
import { useAuthDialog } from "../../../auth/context/AuthDialogContext";
import {
  fetchMyTopicRequests,
  TOPIC_REQUEST_STATUS_DISPLAY,
} from "./myRequestsService";
import type { TopicRequestItem } from "./myRequestsService";

type MyRequestsTabProps = {
  onSwitchToRequestTab: () => void;
};

export default function MyRequestsTab({
  onSwitchToRequestTab,
}: MyRequestsTabProps) {
  const { openAuthDialog } = useAuthDialog();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<TopicRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            onClick={() =>
              openAuthDialog("signin", () => setLoggedIn(true))
            }
          />
          <Button
            variant="outlined"
            label="Sign up"
            onClick={() =>
              openAuthDialog("register", () => setLoggedIn(true))
            }
          />
        </div>
        <div className="mt-4 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-text-secondary">or</span>
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>
        <button
          type="button"
          onClick={onSwitchToRequestTab}
          className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer"
        >
          <EmailOutlinedIcon fontSize="small" />
          Don't have an account?{" "}
          <span className="font-medium text-accent-2">
            Request new topic
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <TextField
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search your requests"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {isLoading && (
        <div className="flex justify-center py-8">
          <CircularProgress size={22} />
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
        items.map((item) => {
          const statusDisplay = TOPIC_REQUEST_STATUS_DISPLAY[item.status];
          return (
            <div
              key={item.id}
              className="rounded-xl border border-gray-100 dark:border-gray-800 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-text-primary">
                  {item.topic}
                </h4>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusDisplay.className}`}
                  >
                    {statusDisplay.label}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{item.domain}</p>
              <p className="mt-2 text-xs text-text-secondary">
                Requested on {formatDate(item.createdAt)}
              </p>
            </div>
          );
        })}
    </div>
  );
}
