import type { Author } from "../../types";

type AuthorCardProps = {
  author: Author;
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-main-background p-6">
      <p className="text-sm font-semibold text-text-primary">
        About the Author
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-base font-semibold text-white">
          {getInitials(author.name)}
        </div>
        <div>
          <p className="font-semibold text-text-primary">{author.name}</p>
          <p className="text-sm text-text-secondary">
            {author.title} at {author.company}
          </p>
        </div>
      </div>
    </div>
  );
}
