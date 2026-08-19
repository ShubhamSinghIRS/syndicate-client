import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useIsMobile } from "../../../../utils/hooks/useIsMobile";
import { useBoolean } from "../../../../utils/hooks/useBoolean";
import { LoadingContext } from "../../../../components/loading/context";
import Loading from "../../../../components/loading/Loading";
import AuthForm from "./form";
import { MODE_COPY } from "../../constants";
import { authDialogPaperSx } from "./AuthDialog.styles";
import type { AuthDialogMode } from "../../types";

type AuthDialogProps = {
  isOpen: boolean;
  handleClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  initialMode?: AuthDialogMode;
  onSuccess: () => void;
};

export default function AuthDialog({
  isOpen,
  handleClose,
  onDirtyChange,
  initialMode = "signin",
  onSuccess,
}: AuthDialogProps) {
  const [mode, setMode] = useState<AuthDialogMode>(initialMode);
  const isMobile = useIsMobile();
  const { value: loading, setValue: setLoading } = useBoolean();

  // Dialog stays mounted, so re-sync mode whenever the caller changes it.
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmitClose = () => {
    setMode(initialMode);
    onSuccess();
  };

  const { title, subtitle } = MODE_COPY[mode];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={authDialogPaperSx}
    >
      <div className="flex h-full">
        {!isMobile && (
          <div className="relative w-[42%] shrink-0 h-full overflow-hidden bg-[#212631]">
            <img
              src="/Design-01.svg"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="relative flex-1 h-full p-6 sm:p-8 flex flex-col justify-center overflow-y-auto">
          <LoadingContext.Provider value={{ loading, setLoading }}>
            <Loading loading={loading} />

            <IconButton onClick={handleClose} aria-label="Close" className="absolute! right-3! top-3!">
              <CloseIcon fontSize="small" />
            </IconButton>

            <div className="flex flex-col items-center text-center">
              <img
                src="/assets/infollion_logo_200x100.png"
                alt="Infollion"
                className="h-16 w-auto mx-auto"
              />
              <h2 className="mt-1.5 text-[18px] font-medium text-slate-700 dark:text-slate-200">
                {title}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            </div>

            <div className="mt-4">
              <AuthForm
                mode={mode}
                setMode={setMode}
                handleSubmitClose={handleSubmitClose}
                onDirtyChange={onDirtyChange}
              />
            </div>
          </LoadingContext.Provider>
        </div>
      </div>
    </Dialog>
  );
}
