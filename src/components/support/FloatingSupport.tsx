import { useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CloseIcon from "@mui/icons-material/Close";
import TextsmsIcon from "@mui/icons-material/Textsms";
import SupportForm from "./form";
import { COLORS } from "../../constants/colors";

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isOpen && (
          <div className="mb-3 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 dark:border-gray-800 bg-main-background p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  Can't find what you're looking for
                </h3>
                <p className="mt-1 text-xs text-text-secondary">
                  We'll get back within one business day
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="mt-4">
              <SupportForm handleSubmitClose={() => setIsOpen(false)} />
            </div>
          </div>
        )}

        <button
          type="button"
          aria-label="Support"
          onClick={handleToggle}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-accent-2 text-white shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-none"
        >
          {isOpen ? (
            <CloseIcon sx={{ fontSize: 26, color: COLORS.mainBackground }} />
          ) : (
            <TextsmsIcon
              sx={{ fontSize: 28, color: COLORS.mainBackground }}
            />
          )}
        </button>
      </div>
    </ClickAwayListener>
  );
}
