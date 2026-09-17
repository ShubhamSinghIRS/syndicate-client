import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "../../../../components/tooltip/Tooltip";
import DialogModal from "../../../../components/dialog/DialogModal";
import WarningDialog from "../../../../components/form-close-warning/WarningDialog";
import { useBoolean } from "../../../../utils/hooks/useBoolean";
import InfoOutlined from "../../../../icons/InfoOutlined/InfoOutlined";
import RequestTopicForm from "./form";
import MyRequestsTab from "./MyRequestsTab";

type RequestTopicDialogProps = {
  isOpen: boolean;
  handleClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  handleSubmitClose: () => void;
};

type DialogTab = "request" | "myRequests";

export default function RequestTopicDialog({
  isOpen,
  handleClose,
  onDirtyChange,
  handleSubmitClose,
}: RequestTopicDialogProps) {
  const [activeTab, setActiveTab] = useState<DialogTab>("request");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const {
    value: isSwitchWarningOpen,
    setTrue: openSwitchWarning,
    setFalse: closeSwitchWarning,
  } = useBoolean();

  useEffect(() => {
    if (isOpen) {
      setActiveTab("request");
      setIsFormDirty(false);
    }
  }, [isOpen]);

  // Switching away from "Request a topic" unmounts the form, silently
  // discarding whatever the user typed - so it gets the same confirmation
  // as closing the dialog with unsaved changes, rather than switching tabs
  // for free.
  const handleTabClick = (tab: DialogTab) => {
    if (tab === activeTab) return;
    if (activeTab === "request" && isFormDirty) {
      openSwitchWarning();
      return;
    }
    setActiveTab(tab);
  };

  const handleFormDirtyChange = (dirty: boolean) => {
    setIsFormDirty(dirty);
    onDirtyChange(dirty);
  };

  const confirmTabSwitch = () => {
    closeSwitchWarning();
    setIsFormDirty(false);
    onDirtyChange(false);
    setActiveTab("myRequests");
  };

  return (
    <DialogModal
      isOpen={isOpen}
      handleClose={handleClose}
      title={
        <span className="flex items-center gap-1">
          Request a topic
          <Tooltip
            title="Don't see the topic you need? Request it and we'll try to get it covered."
            arrow
            placement="bottom"
          >
            <IconButton size="small" sx={{ color: "inherit", p: 0.5 }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </span>
      }
      dialogSx={{
        "& .MuiDialog-paper": {
          maxWidth: "560px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
      contentSx={{
        padding: "1.25rem 1.5rem",
      }}
    >
      <div className="mt-2 mb-4 flex gap-6 border-b border-gray-100 dark:border-gray-800">
        {([
          { key: "request", label: "Request a topic" },
          { key: "myRequests", label: "My requests" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabClick(tab.key)}
            className={`relative -mb-px cursor-pointer pb-2.5 text-sm font-medium ${
              activeTab === tab.key
                ? "text-accent-2"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent-2" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "request" ? (
        <RequestTopicForm
          handleClose={handleClose}
          onDirtyChange={handleFormDirtyChange}
          handleSubmitClose={handleSubmitClose}
        />
      ) : (
        <MyRequestsTab />
      )}

      <WarningDialog
        open={isSwitchWarningOpen}
        handleClose={closeSwitchWarning}
        handleYesClick={confirmTabSwitch}
        text="Switching tabs will discard your unsaved topic request. Continue?"
      />
    </DialogModal>
  );
}
