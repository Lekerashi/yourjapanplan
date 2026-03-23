import Link from "next/link";
import { MapPin } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-bold">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span>{SITE_NAME}</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/quiz" className="hover:text-foreground transition-colors">
              Plan My Trip
            </Link>
            <Link href="/destinations" className="hover:text-foreground transition-colors">
              Destinations
            </Link>
            <Link href="/tools/jr-pass" className="hover:text-foreground transition-colors">
              JR Pass Calculator
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
