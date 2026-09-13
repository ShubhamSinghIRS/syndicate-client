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
    <div className="flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-14 py-8 md:py-12">
      {/* Left Column: Copy & Actions */}
      <div className="w-full flex-1 md:max-w-lg lg:max-w-xl">
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
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl lg:text-5xl leading-[1.15]">
          Turn your expertise
          <br />
          <span style={{ color: COLORS.accent2 }}>into impact and income.</span>
        </h2>
        <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg">
          Share a recorded session or upload a document. Once reviewed, your
          expertise goes live on the Syndicate marketplace and earns every
          time it's accessed.
        </p>

        <div className="mt-8 flex flex-wrap items-start gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href={CONTRIBUTOR_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                label="Join As An Expert"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                styles={{ fontWeight: 600, fontSize: "14px", height: "46px", padding: "0 28px", borderRadius: "9999px" }}
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
                label="Sign In To Share"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                styles={{ fontWeight: 600, fontSize: "14px", height: "46px", padding: "0 28px", borderRadius: "9999px" }}
              />
            </Link>
            <span className="text-xs text-text-secondary">
              Already an Infollion Expert?
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Waveform & 4 Process Steps (Matching Reference Image) */}
      <div className="relative w-full md:flex-[1.4] lg:flex-[1.5] min-h-[320px] sm:min-h-[380px] flex items-center">
        <TranscriptWaveform />

        <div className="relative z-10 w-full px-2">
          {/* Dashed connector line passing through circle centers */}
          <div
            className="absolute top-8 left-[12.5%] right-[12.5%] h-[0px] border-t-2 border-dashed pointer-events-none"
            style={{ borderColor: COLORS.accent2 }}
          />

          {/* 4 Process Step Nodes */}
          <div className="relative z-10 flex justify-between">
            {STEPS.map(({ icon: Icon, title, subtitle }) => (
              <div
                key={title}
                className="flex w-1/4 flex-col items-center text-center px-1"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-main-background shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100/50 dark:border-zinc-800">
                  <Icon style={{ color: COLORS.accent2, fontSize: "28px" }} />
                </div>
                <span className="mt-4 text-center text-[11px] font-extrabold uppercase tracking-wider text-text-primary leading-tight max-w-[120px]">
                  {title}
                </span>
                <span className="mt-1.5 text-center text-[11px] text-text-secondary leading-normal max-w-[125px]">
                  {subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
