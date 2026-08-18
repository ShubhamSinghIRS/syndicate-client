import CheckCircleIcon from "../../../../icons/CheckCircle/CheckCircle";
import { COLORS } from "../../../../constants/colors";

type Requirement = {
  label: string;
  test: (value: string) => boolean;
};

const REQUIREMENTS: Requirement[] = [
  { label: "8+ characters", test: (value) => value.length >= 8 },
  { label: "Uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "Lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "Number", test: (value) => /\d/.test(value) },
  { label: "Special character", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

type PasswordRequirementsProps = {
  password: string;
};

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
      {REQUIREMENTS.map((requirement) => {
        const met = requirement.test(password);
        return (
          <li
            key={requirement.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              met ? "font-medium" : "text-text-secondary"
            }`}
            style={met ? { color: COLORS.accent2 } : undefined}
          >
            {met ? (
              <CheckCircleIcon sx={{ fontSize: 14, color: COLORS.accent2 }} />
            ) : (
              <span className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-current" />
            )}
            {requirement.label}
          </li>
        );
      })}
    </ul>
  );
}
