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
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-3 lg:w-64 lg:shrink-0">
      {/* On mobile, nav items are horizontally scrollable */}
      <nav className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:pb-0">
        {LINK_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

      <nav className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:pb-0">
        {NAV_ITEMS.map((item) => {
          const isActive = item.tab === activeTab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
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
