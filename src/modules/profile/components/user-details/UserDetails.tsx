type UserDetailsProps = {
  userName: string | null;
  email: string | null;
  companyName?: string | null;
};

export default function UserDetails({
  userName,
  email,
  companyName,
}: UserDetailsProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-main-background p-6">
      <h3 className="text-base font-bold text-text-primary border-b border-gray-200 dark:border-gray-800 pb-3 mb-4">
        My Profile
      </h3>

      <div className="grid grid-cols-1 gap-y-3 text-sm">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 items-center">
          <span className="font-semibold text-text-primary">Full Name</span>
          <span className="col-span-2 sm:col-span-3 md:col-span-5 text-text-secondary">
            {userName || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 items-center">
          <span className="font-semibold text-text-primary">Work Email</span>
          <span className="col-span-2 sm:col-span-3 md:col-span-5 text-text-secondary">
            {email || "N/A"}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 items-center">
          <span className="font-semibold text-text-primary">Company Name</span>
          <span className="col-span-2 sm:col-span-3 md:col-span-5 text-text-secondary">
            {companyName || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
