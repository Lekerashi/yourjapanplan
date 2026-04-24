import { cn } from "@/lib/utils";

export function SeigaihaDivider({
  className,
  height = 40,
  opacity = 0.55,
}: {
  className?: string;
  height?: number;
  opacity?: number;
}) {
  const patternId = "seigaiha-pattern";
  return (
    <div
      className={cn(
        "w-full border-y border-line text-line",
        className,
      )}
      style={{ height, opacity }}
      aria-hidden
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 120 20"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="24"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 A12 12 0 0 1 24 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.5"
            />
            <path
              d="M-12 20 A12 12 0 0 1 12 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
