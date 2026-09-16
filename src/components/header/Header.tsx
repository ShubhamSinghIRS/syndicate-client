import { useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { APP_ROUTES } from "../../constants/appRoutes";
import { useAuthDialog } from "../../modules/auth/context/AuthDialogContext";
import AccountMenu from "./AccountMenu";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import SearchBar from "../searchbar/SearchBar";
import { isLoggedIn, useIsLoggedIn } from "../../utils/authUtils";
import { getStorageItem } from "../../utils/storageUtils";
import { useCart } from "../../modules/cart/hooks/useCart";

type HeaderProps = {
  isSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  isExtraComponent?: boolean;
  component?: ReactNode;
};

export default function Header({
  isSearch = false,
  searchPlaceholder = "",
  searchValue = "",
  onSearch,
  isExtraComponent = false,
  component,
}: HeaderProps) {
  const { openAuthDialog } = useAuthDialog();
  // Reactive - re-renders the instant login state changes elsewhere (e.g.
  // logout), rather than only reflecting it whenever this component happens
  // to next re-render for some unrelated reason.
  const loggedIn = useIsLoggedIn();
  const userName = getStorageItem<string>("userName");
  const { items: cartItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);

  // The header is `fixed`, so pages reserve space for it with padding-top.
  // Its real height varies (search bar wrapping onto its own row below `lg`,
  // a long account name wrapping the nav row below `sm`, etc.), so a static
  // Tailwind value goes stale the moment that content changes - this keeps
  // --header-height in sync with whatever actually renders.
  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    const setHeightVar = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${node.offsetHeight}px`,
      );
    };
    setHeightVar();

    const observer = new ResizeObserver(setHeightVar);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (searchParams.get("authRequired") && !isLoggedIn()) {
      const redirectUrl = searchParams.get("redirect_url");
      openAuthDialog("signin", () => {
        if (redirectUrl) navigate(redirectUrl);
      });
      searchParams.delete("authRequired");
      searchParams.delete("redirect_url");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-[#1c1f2b] border-b border-gray-100 dark:border-gray-800/60 shadow-sm"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-2 sm:px-12 lg:flex-nowrap lg:gap-6 lg:px-20">
        <Link to={APP_ROUTES.home} className="flex shrink-0 items-center">
          <img
            src="/assets/logo_hd.png"
            alt="Infollion"
            className="h-8 w-auto dark:hidden md:h-10"
          />
          <img
            src="/assets/logo_hd_dark_mode.png"
            alt="Infollion"
            className="hidden h-8 w-auto dark:block md:h-10"
          />
        </Link>

        {isSearch && (
          <div className="order-last flex w-full flex-wrap items-center gap-3 lg:order-none lg:w-auto lg:max-w-3xl lg:flex-1 lg:flex-nowrap">
            <div className="min-w-0 flex-1">
              <SearchBar
                placeholder={searchPlaceholder}
                searchValue={searchValue}
                onSearch={onSearch ?? (() => {})}
                maxWidth="100%"
                height="40px"
              />
            </div>
            {isExtraComponent && (
              <div className="w-full sm:w-auto">{component}</div>
            )}
          </div>
        )}

        <nav className="flex shrink-0 items-center gap-2 text-sm text-text-primary sm:gap-4">
          {!isSearch && isExtraComponent && component}

          <ThemeToggle />

          <Link
            to={APP_ROUTES.cart}
            aria-label="Cart"
            className="relative flex items-center p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.87-4.594 2.242-6.65a.75.75 0 0 0-.72-.9H5.106M7.5 14.25 5.106 5.25M7.5 14.25 5.106 5.25"
              />
              <circle
                cx="9"
                cy="20.25"
                r="0.75"
                fill="currentColor"
                stroke="none"
              />
              <circle
                cx="18"
                cy="20.25"
                r="0.75"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-accent-2 text-[11px] font-semibold text-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {loggedIn ? (
            <AccountMenu userName={userName} />
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-sm sm:px-4 sm:py-2">
              <button
                type="button"
                onClick={() => openAuthDialog("signin")}
                className="cursor-pointer font-bold text-accent-2 hover:opacity-75 transition-colors"
              >
                Login
              </button>
              <span className="text-accent-2/30">|</span>
              <button
                type="button"
                onClick={() => openAuthDialog("register")}
                className="cursor-pointer font-bold text-accent-2 hover:opacity-75 transition-colors"
              >
                Sign up
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
