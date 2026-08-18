import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import AuthDialog from "../components/auth-dialog";
import WarningDialog from "../../../components/form-close-warning/WarningDialog";
import { useFormCloseWarning } from "../../../utils/hooks/useFormCloseWarning";
import type { AuthDialogMode } from "../types";

type AuthDialogContextValue = {
  // Opens the auth dialog in place; `onSuccess` runs after sign-in/register.
  openAuthDialog: (mode?: AuthDialogMode, onSuccess?: () => void) => void;
};

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthDialogMode>("signin");
  const [onSuccessCallback, setOnSuccessCallback] = useState<
    (() => void) | null
  >(null);
  const {
    isOpen,
    open,
    requestClose,
    setDirty,
    isWarningOpen,
    closeWarning,
    confirmDiscard,
    notifySubmitted,
  } = useFormCloseWarning();

  const openAuthDialog = useCallback(
    (newMode: AuthDialogMode = "signin", onSuccess?: () => void) => {
      setMode(newMode);
      setOnSuccessCallback(() => onSuccess ?? null);
      open();
    },
    [open],
  );

  const handleSuccess = () => {
    notifySubmitted();
    onSuccessCallback?.();
    setOnSuccessCallback(null);
  };

  return (
    <AuthDialogContext.Provider value={{ openAuthDialog }}>
      {children}
      <AuthDialog
        isOpen={isOpen}
        handleClose={requestClose}
        onDirtyChange={setDirty}
        initialMode={mode}
        onSuccess={handleSuccess}
      />
      <WarningDialog
        open={isWarningOpen}
        handleClose={closeWarning}
        handleYesClick={confirmDiscard}
        text="Are you sure you want to close? The information you've entered will be lost."
      />
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog(): AuthDialogContextValue {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useAuthDialog must be used within an AuthDialogProvider");
  }
  return context;
}
