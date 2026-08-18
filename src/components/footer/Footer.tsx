import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/appRoutes";

const SUPPORT_EMAIL = "syndicatesupport@infollion.com";

type FooterProps = {
  style?: React.CSSProperties;
};

export default function Footer({ style }: FooterProps) {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      enqueueSnackbar("Email copied to clipboard", { variant: "success" });
    } catch {
      enqueueSnackbar("Couldn't copy email", { variant: "error" });
    }
  };

  return (
    <footer
      className="bg-[#F8F6F3] dark:bg-section-background border-t border-[#E9E4DC] dark:border-gray-800"
      style={style}
    >
      {/* Upper Footer: Multi-column Links */}
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to={APP_ROUTES.home} className="flex items-center">
              <img
                src="/assets/logo_hd.png"
                alt="Infollion"
                className="h-10 w-auto animate-fade-in"
              />
            </Link>
            <p className="text-base text-text-secondary leading-relaxed max-w-xs">
              On-Demand Experts. High-quality firsthand business research and curated transcripts.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.linkedin.com/company/infollion/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors duration-200 hover:text-accent-2"
              >
                <LinkedInIcon sx={{ fontSize: 28 }} />
              </a>
              <a
                href="https://x.com/infollion"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors duration-200 hover:text-accent-2"
              >
                <TwitterIcon sx={{ fontSize: 28 }} />
              </a>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to={APP_ROUTES.transcripts}
                  className="text-base text-text-secondary hover:text-accent-2 transition-colors duration-200 block"
                >
                  Browse Transcripts
                </Link>
              </li>
              <li>
                <a
                  href="https://www.infollion.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-text-secondary hover:text-accent-2 transition-colors duration-200 block"
                >
                  For Experts
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to={APP_ROUTES.termsOfUse}
                  className="text-base text-text-secondary hover:text-accent-2 transition-colors duration-200 block"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">
              Help
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to={`${APP_ROUTES.home}#faq`}
                  className="text-base text-text-secondary hover:text-accent-2 transition-colors duration-200 block"
                >
                  Help FAQs
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  onClick={handleCopyEmail}
                  className="text-base text-text-secondary hover:text-accent-2 transition-colors duration-200 block"
                >
                  Customer Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Copyright bar */}
      <div className="border-t border-[#E9E4DC] dark:border-gray-800">
        <div className="mx-auto max-w-[1400px] px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-text-secondary gap-4">
          <span>© {new Date().getFullYear()} Infollion. On-Demand Experts. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
