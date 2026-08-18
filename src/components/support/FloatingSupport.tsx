import { useState } from "react";
import { useSnackbar } from "notistack";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "../../icons/ExpandMore/ExpandMore";
import HeadsetIcon from "../../icons/Headset/Headset";
import AccessTimeIcon from "../../icons/AccessTime/AccessTime";
import EmailOutlinedIcon from "../../icons/EmailOutlined/EmailOutlined";
import { COLORS } from "../../constants/colors";
import { useFormCloseWarning } from "../../utils/hooks/useFormCloseWarning";
import WarningDialog from "../form-close-warning/WarningDialog";
import SupportForm from "./form";

const SUPPORT_EMAIL = "syndicatesupport@infollion.com";

export default function FloatingSupport() {
  const {
    isOpen,
    open,
    requestClose,
    setDirty,
    isWarningOpen,
    closeWarning,
    confirmDiscard,
  } = useFormCloseWarning();
  const [showContactForm, setShowContactForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleToggle = () => {
    if (isOpen) {
      requestClose();
    } else {
      open();
    }
  };

  const handleDiscard = () => {
    setShowContactForm(false);
    confirmDiscard();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      enqueueSnackbar("Email copied to clipboard", { variant: "success" });
    } catch {
      enqueueSnackbar("Couldn't copy email", { variant: "error" });
    }
  };

  return (
    <ClickAwayListener onClickAway={requestClose}>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isOpen && (
          <div className="mb-3 w-[460px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 dark:border-gray-800 bg-main-background p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <HeadsetIcon sx={{ fontSize: 32, color: COLORS.accent2 }} />
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Need help?
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    We're here to support you.
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                    <AccessTimeIcon fontSize="inherit" />
                    We'll respond within one business day.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={requestClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <EmailOutlinedIcon
                  sx={{ fontSize: 20, color: COLORS.accent2 }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">Email us</p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  onClick={handleCopyEmail}
                  className="text-sm font-medium text-accent-2 hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <button
                type="button"
                aria-label="Copy support email"
                onClick={handleCopyEmail}
                className="text-text-primary hover:text-accent-2"
              >
                <ContentCopyOutlinedIcon fontSize="small" />
              </button>
            </div>

            <div className="mt-3 border-t border-gray-100 dark:border-gray-800 pt-3">
              <button
                type="button"
                onClick={() => setShowContactForm((prev) => !prev)}
                aria-expanded={showContactForm}
                className="flex w-full items-center gap-3 text-left cursor-pointer"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <EmailIcon sx={{ fontSize: 20, color: COLORS.accent2 }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    Send us a message
                  </p>
                </div>
                <ExpandMoreIcon
                  fontSize="small"
                  className={`text-text-secondary transition-transform duration-200 ${
                    showContactForm ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showContactForm && (
                <div className="mt-4">
                  <SupportForm
                    onSent={() => setShowContactForm(false)}
                    onDirtyChange={setDirty}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <WarningDialog
          open={isWarningOpen}
          handleClose={closeWarning}
          handleYesClick={handleDiscard}
        />

        <button
          type="button"
          aria-label="Support"
          onClick={handleToggle}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-accent-2 text-white shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-none"
        >
          {isOpen ? (
            <CloseIcon sx={{ fontSize: 26, color: COLORS.mainBackground }} />
          ) : (
            <HeadsetIcon sx={{ fontSize: 28, color: COLORS.mainBackground }} />
          )}
        </button>
      </div>
    </ClickAwayListener>
  );
}
