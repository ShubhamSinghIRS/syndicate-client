import { PASSWORD_REQUIREMENTS } from "../../constants";

type PasswordRequirementsProps = {
  password: string;
};

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  if (!password) return null;

  const metCount = PASSWORD_REQUIREMENTS.filter((requirement) => requirement.test(password)).length;
  const missing = PASSWORD_REQUIREMENTS.filter((requirement) => !requirement.test(password)).map(
    (requirement) => requirement.label,
  );
  return (
    <div className="mt-1.5">
      <div className="flex gap-1.5">
        {PASSWORD_REQUIREMENTS.map((requirement, index) => (
          <span
            key={requirement.label}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index < metCount ? "bg-accent-2" : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
      <p
        className={`mt-1.5 text-xs ${
          missing.length > 0 ? "text-text-secondary" : "font-medium text-accent-2"
        }`}
      >
        {missing.length > 0 ? `Add: ${missing.join(", ")}.` : "Strong password."}
      </p>
    </div>
  );
}
