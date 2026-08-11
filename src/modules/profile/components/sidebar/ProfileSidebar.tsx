import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../../../constants/appRoutes";
import type { ProfileTab } from "../../types";

type ProfileSidebarProps = {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
};

const LINK_ITEMS: { to: string; label: string; icon: React.ReactNode }[] = [
  { to: APP_ROUTES.home, label: "Home", icon: <HomeOutlinedIcon fontSize="small" /> },
  { to: APP_ROUTES.transcripts, label: "Transcripts", icon: <DescriptionOutlinedIcon fontSize="small" /> },
];

const NAV_ITEMS: { tab: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { tab: "profile", label: "My Profile", icon: <PersonOutlineIcon fontSize="small" /> },
  { tab: "purchases", label: "Purchases", icon: <ShoppingBagOutlinedIcon fontSize="small" /> },
  { tab: "invoice", label: "Invoice", icon: <ReceiptLongIcon fontSize="small" /> },
];

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: ProfileSidebarProps) {
  return (
    <div className="w-64 shrink-0 rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-3">
      <nav className="flex flex-col gap-1">
        {LINK_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.tab === activeTab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-accent-2 text-white"
                  : "text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
