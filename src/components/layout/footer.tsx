import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { BrandMark } from "./brand-mark";

const PLAN_LINKS = [
  { href: "/quiz", label: "The quiz" },
  { href: "/itinerary/new", label: "Custom itinerary" },
  { href: "/destinations", label: "Destinations" },
  { href: "/itinerary/saved", label: "My itineraries" },
];

const TOOL_LINKS = [
  { href: "/tools/jr-pass", label: "JR Pass calculator" },
  { href: "/itinerary/new", label: "Packing list" },
  { href: "/destinations", label: "Crowd calendar" },
  { href: "/itinerary/new", label: "Reservation timeline" },
];

const COMPANY_LINKS = [
  { href: "/", label: "About" },
  { href: "/", label: "Writers" },
  { href: "/", label: "Press" },
  { href: "/", label: "Contact" },
];

function SeigaihaCorner() {
  return (
    <svg
      width="72"
      height="20"
      viewBox="0 0 72 20"
      aria-hidden
      className="text-line opacity-60"
    >
      <defs>
        <pattern
          id="seigaiha-corner"
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
            strokeWidth="0.7"
            opacity="0.7"
          />
          <path
            d="M-12 20 A12 12 0 0 1 12 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.7"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha-corner)" />
    </svg>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h5 className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {heading}
      </h5>
      <ul className="flex flex-col gap-2.5">
        {links.map((link, i) => (
          <li key={`${link.href}-${i}`}>
            <Link
              href={link.href}
              className="text-sm text-foreground transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary text-foreground">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} />
              <span className="font-display text-[17px] font-semibold tracking-[-0.01em]">
                {SITE_NAME}
              </span>
            </div>
            <p className="mt-3 max-w-[22ch] text-sm text-muted-foreground">
              Built for travellers, not tourists.
            </p>
          </div>
          <FooterColumn heading="Plan" links={PLAN_LINKS} />
          <FooterColumn heading="Tools" links={TOOL_LINKS} />
          <FooterColumn heading="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}
          </span>
          <SeigaihaCorner />
        </div>
      </div>
    </footer>
  );
}
