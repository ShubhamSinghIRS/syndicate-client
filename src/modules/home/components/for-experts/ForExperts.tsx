import Link from "@mui/material/Link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import Button from "../../../../components/button/Button";
import { COLORS } from "../../../../constants/colors";
import { TranscriptWaveform } from "./TranscriptWaveform";

const CONTRIBUTOR_SIGNUP_URL = "https://webapp.infollion.com/register-user";
const CONTRIBUTOR_LOGIN_URL = "https://webapp.infollion.com/login";

const STEPS: { icon: SvgIconComponent; title: string; subtitle: string }[] = [
  { icon: UploadFileOutlinedIcon, title: "You Share", subtitle: "Session or document" },
  { icon: GppGoodOutlinedIcon, title: "We Review", subtitle: "Reviewed and transcribed by Infollion" },
  {
    icon: LanguageOutlinedIcon,
    title: "Live on Marketplace",
    subtitle: "Discoverable by clients worldwide",
  },
  {
    icon: CurrencyRupeeOutlinedIcon,
    title: "You Earn",
    subtitle: "Rewarded when it's purchased.",
  },
];

export default function ForExperts() {
  return (
    <div className="flex items-stretch gap-8 py-10">
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-2">
          <span
            className="h-4 w-1 rounded-full"
            style={{ backgroundColor: COLORS.accent2 }}
          />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: COLORS.accent2 }}
          >
            For Experts
          </span>
        </div>
        <h2 className="text-balance text-3xl font-bold text-text-primary sm:text-4xl">
          Turn your expertise
          <br />
          <span style={{ color: COLORS.accent2 }}>into impact and income.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-text-secondary leading-relaxed">
          Share a recorded session or upload a document. Once reviewed, your
          expertise goes live on the Infollion marketplace and earns every
          time it's accessed.
        </p>
        <div className="mt-6 flex flex-wrap items-start gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href={CONTRIBUTOR_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                label="Join as an Expert"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                styles={{ fontWeight: 600, fontSize: "14px", height: "42px", padding: "0 28px" }}
              />
            </Link>
            <span className="text-xs text-text-secondary">New to Infollion?</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href={CONTRIBUTOR_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <Button
                variant="outlined-accent"
                label="Sign in to Share"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                styles={{ fontWeight: 600, fontSize: "14px", height: "42px", padding: "0 28px" }}
              />
            </Link>
            <span className="text-xs text-text-secondary">
              Already an Infollion Expert?
            </span>
          </div>
        </div>
      </div>
      <div className="relative hidden flex-[1.45] md:block min-h-[350px]">
        <TranscriptWaveform />
        <div className="absolute inset-0 px-0">
          <div className="relative w-full h-full">
            {/* Dashed connector segments */}
            {/* Segment 1: Green line between Step 1 and Step 2 */}
            <div
              className="absolute top-[58%] -translate-y-1/2"
              style={{
                left: "calc(12.5% + 46px)",
                right: "calc(62.5% + 46px)",
                height: "1.5px",
                backgroundImage: `linear-gradient(to right, ${COLORS.accent2} 50%, transparent 50%)`,
                backgroundSize: "8px 100%",
                backgroundRepeat: "repeat-x",
              }}
            />
            {/* Segment 2: Green line between Step 2 and Step 3 */}
            <div
              className="absolute top-[58%] -translate-y-1/2"
              style={{
                left: "calc(37.5% + 46px)",
                right: "calc(37.5% + 46px)",
                height: "1.5px",
                backgroundImage: `linear-gradient(to right, ${COLORS.accent2} 50%, transparent 50%)`,
                backgroundSize: "8px 100%",
                backgroundRepeat: "repeat-x",
              }}
            />
            {/* Segment 3: Orange line between Step 3 and Step 4 */}
            <div
              className="absolute top-[58%] -translate-y-1/2"
              style={{
                left: "calc(62.5% + 46px)",
                right: "calc(12.5% + 46px)",
                height: "1.5px",
                backgroundImage: `linear-gradient(to right, ${COLORS.accent2} 50%, transparent 50%)`,
                backgroundSize: "8px 100%",
                backgroundRepeat: "repeat-x",
              }}
            />

            <div className="absolute top-[58%] -translate-y-8 left-0 right-0 flex justify-between">
              {STEPS.map(({ icon: Icon, title, subtitle }) => (
                <div
                  key={title}
                  className="relative z-10 flex w-1/4 flex-col items-center text-center px-1"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-main-background shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100/30 dark:border-zinc-800/50"
                  >
                    <Icon style={{ color: COLORS.accent2, fontSize: "28px" }} />
                  </div>
                  <span className="mt-4 whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wider text-text-primary">
                    {title}
                  </span>
                  <span className="mt-1.5 text-[11px] text-text-secondary leading-normal max-w-[120px]">
                    {subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
