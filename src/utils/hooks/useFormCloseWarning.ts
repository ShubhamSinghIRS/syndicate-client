import { useBoolean } from "./useBoolean";

// Shared "warn before losing unsaved changes" wiring for a dialog that
// contains a form: requestClose() only closes immediately when the form
// isn't dirty, otherwise it opens a confirmation dialog first.
export function useFormCloseWarning() {
  const { value: isOpen, setTrue: open, setFalse: closeDialog } = useBoolean();
  const { value: isDirty, setValue: setDirty } = useBoolean();
  const {
    value: isWarningOpen,
    setTrue: openWarning,
    setFalse: closeWarning,
  } = useBoolean();

  const requestClose = () => {
    if (isDirty) {
      openWarning();
    } else {
      closeDialog();
    }
  };

  const confirmDiscard = () => {
    closeWarning();
    setDirty(false);
    closeDialog();
  };

  const notifySubmitted = () => {
    setDirty(false);
    closeDialog();
  };

  return {
    isOpen,
    open,
    requestClose,
    isDirty,
    setDirty,
    isWarningOpen,
    closeWarning,
    confirmDiscard,
    notifySubmitted,
  };
}
