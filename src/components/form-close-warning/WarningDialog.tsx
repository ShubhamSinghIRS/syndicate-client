import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import Button from "../button/Button";

type Props = {
  handleClose: () => void;
  handleYesClick: () => void | Promise<void>;
  open: boolean;
  yesLabel?: string;
  text?: string;
  textSx?: SxProps<Theme>;
  hideCancelBtn?: boolean;
};

const WarningDialog = (props: Props) => {
  const {
    text = "Are you sure you want to close the form without saving the changes?",
    handleClose,
    handleYesClick,
    open,
    yesLabel,
    textSx,
    hideCancelBtn = false,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", maxWidth: "360px" },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ paddingBottom: "0", fontSize: "1rem", ...textSx }}
      >
        {text}
      </DialogTitle>
      <DialogActions
        sx={{ display: "flex", gap: "0.25rem", paddingRight: "20px" }}
      >
        {!hideCancelBtn && (
          <Button label="Cancel" variant="outlined" onClick={handleClose} />
        )}
        <Button
          label={yesLabel || "Yes"}
          variant="contained"
          onClick={handleYesClick}
        />
      </DialogActions>
    </Dialog>
  );
};

export default WarningDialog;
