import { useEffect, useState } from "react";
import Link from "@mui/material/Link";
import Button from "../../../../components/button/Button";
import { TranscriptWaveform } from "./TranscriptWaveform";

const CONTRIBUTOR_SIGNUP_URL = "https://webapp.infollion.com/register-user";

const HEADLINES = [
  {
    line1: "Somewhere, a client is searching",
    line2: "for exactly what you know.",
  },
  {
    line1: "Every buzz in the market starts",
    line2: "with someone who saw it first.",
  },
];
const HEADLINE_INTERVAL_MS = 10000;
const FADE_DURATION_MS = 300;

export default function ContributorCta() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setHeadlineIndex((i) => (i + 1) % HEADLINES.length);
        setIsVisible(true);
      }, FADE_DURATION_MS);
    }, HEADLINE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-stretch gap-8 overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-main-background py-10 pl-10 shadow-sm">
      <div className="flex-[1.4]">
        <h2
          className={`text-balance text-3xl font-bold text-text-primary transition-all duration-500 ease-in-out sm:text-4xl ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
        >
          {HEADLINES[headlineIndex].line1}
          <br />
          {HEADLINES[headlineIndex].line2}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-text-secondary leading-relaxed">
          Record a session or upload a document. Once reviewed, it's live for clients, and you earn every time it's accessed.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={CONTRIBUTOR_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
          >
            <Button
              variant="contained"
              label="Share your expertise"
              styles={{ fontWeight: 600, fontSize: "14px", height: "42px", padding: "0 28px" }}
            />
          </Link>
          <Link
            href="https://webapp.infollion.com/login"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
          >
            <Button
              variant="contained"
              label="Existing user? Log in and share"
              styles={{ fontWeight: 600, fontSize: "14px", height: "42px", padding: "0 28px" }}
            />
          </Link>
        </div>
      </div>
      <div className="relative hidden max-w-md flex-1 md:block -my-10">
        <TranscriptWaveform />
      </div>
    </div>
  );
}
