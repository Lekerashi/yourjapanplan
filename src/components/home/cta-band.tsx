import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTABand() {
  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-[clamp(20px,4vw,40px)] py-[clamp(72px,10vw,120px)] md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-[18ch] font-display text-[clamp(36px,6vw,72px)] font-medium leading-[1.0] tracking-[-0.02em]">
          Ready to plan your{" "}
          <span className="font-display italic font-normal text-accent">
            Japan trip?
          </span>
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button
            size="lg"
            variant="outline"
            className="border-background text-background hover:bg-background hover:text-foreground"
            render={<Link href="/quiz" />}
          >
            Take the quiz
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Button>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground"
            render={<Link href="/itinerary/new" />}
          >
            Build from scratch
          </Button>
        </div>
      </div>
    </section>
  );
}
