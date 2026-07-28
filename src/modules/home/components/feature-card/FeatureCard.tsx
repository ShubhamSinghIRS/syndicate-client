import VerifiedUserIcon from "../../../../icons/VerifiedUser/VerifiedUser";
import DescriptionIcon from "../../../../icons/Description/Description";
import BoltIcon from "../../../../icons/Bolt/Bolt";
import HeadsetIcon from "../../../../icons/Headset/Headset";
import type { FEATURE_CARDS } from "../../constants/homeConstants";

const ICONS = {
  VerifiedUser: VerifiedUserIcon,
  Description: DescriptionIcon,
  Bolt: BoltIcon,
  Headset: HeadsetIcon,
};

type FeatureCardProps = (typeof FEATURE_CARDS)[number];

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  const Icon = ICONS[icon];

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-main-background p-8 shadow-sm flex flex-col items-center text-center gap-4 transition-shadow hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent-2">
        <Icon fontSize="medium" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-text-primary">{title}</h3>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
