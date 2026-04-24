import { SectionHead } from "./section-head";

const STEPS = [
  {
    num: "01",
    title: "Tell us how you travel",
    body: "Pace, dates, budget, and what you have already done.",
  },
  {
    num: "02",
    title: "See your shortlist",
    body: "A map of Japan narrowed to the regions and cities that match you.",
  },
  {
    num: "03",
    title: "Build the plan",
    body: "A day-by-day itinerary with trains, lodging areas, and what to reserve in advance.",
  },
];

export function HowItWorks() {
  return (
    <section>
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-[clamp(56px,8vw,96px)]">
        <SectionHead
          eyebrow="How it works"
          title={
            <>
              Three steps,
              <br />
              <span className="font-display italic font-normal text-accent">
                one good trip.
              </span>
            </>
          }
          lede="Tell us your preferences once and we'll curate a plan you can actually follow."
        />

        <div className="mt-[clamp(32px,5vw,48px)] grid overflow-hidden border border-border bg-card md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={
                "flex min-h-[240px] flex-col justify-between gap-6 p-[clamp(20px,3vw,28px)] " +
                (i < STEPS.length - 1
                  ? "border-b border-border md:border-r md:border-b-0"
                  : "")
              }
            >
              <div>
                <div className="font-display text-[60px] italic font-normal leading-[0.9] text-accent">
                  {step.num}
                </div>
                <div className="mt-4 mb-3 h-px w-7 bg-accent" />
              </div>
              <div>
                <h3 className="font-display text-[20px] font-medium tracking-[-0.01em] text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[14.5px] text-ink-2">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

