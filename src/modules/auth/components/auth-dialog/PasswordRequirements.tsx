type Requirement = {
  label: string;
  test: (value: string) => boolean;
};

const REQUIREMENTS: Requirement[] = [
  { label: "8+ characters", test: (value) => value.length >= 8 },
  { label: "uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "number", test: (value) => /\d/.test(value) },
  { label: "special character", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

type PasswordRequirementsProps = {
  password: string;
};

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  if (!password) return null;

  const metCount = REQUIREMENTS.filter((requirement) => requirement.test(password)).length;
  const missing = REQUIREMENTS.filter((requirement) => !requirement.test(password)).map(
    (requirement) => requirement.label,
  );
  return (
    <div className="mt-1.5">
      <div className="flex gap-1.5">
        {REQUIREMENTS.map((requirement, index) => (
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
