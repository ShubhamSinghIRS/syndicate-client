import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type BackButtonProps = {
  label: string;
  to: string;
};

// Always navigates to the named destination - the label commits to a
// specific place (e.g. "Back to Transcripts"), so using browser history
// here would break that promise whenever the user arrived via some other
// page (e.g. Terms of Use -> Cart -> "Back to Transcripts" landing back on
// Terms of Use instead).
export default function BackButton({ label, to }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="flex items-center gap-1 text-sm font-medium text-text-primary hover:text-accent-2 cursor-pointer"
    >
      <ArrowBackIcon fontSize="small" />
      {label}
    </button>
  );
}
