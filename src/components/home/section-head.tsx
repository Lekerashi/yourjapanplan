export function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
}) {
  return (
    <div className="grid items-end gap-[clamp(24px,5vw,56px)] border-b border-border pb-6 md:grid-cols-[1fr_1.4fr]">
      <div>
        <p className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <h2 className="mt-3.5 font-display text-[clamp(32px,5vw,54px)] font-medium leading-[1.05] tracking-[-0.015em] text-foreground">
          {title}
        </h2>
      </div>
      {lede && (
        <p className="max-w-[52ch] text-[clamp(15px,1.3vw,17px)] text-ink-2">
          {lede}
        </p>
      )}
    </div>
  );
}
