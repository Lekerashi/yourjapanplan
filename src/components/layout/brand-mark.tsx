export function BrandMark({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden
      className={className}
    >
      <circle cx="16" cy="16" r="15" fill="var(--accent)" />
      <path
        d="M7 20 Q12 14 16 18 T25 18"
        stroke="#fbf6ec"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M7 23 Q12 17 16 21 T25 21"
        stroke="#fbf6ec"
        strokeWidth="1.4"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
