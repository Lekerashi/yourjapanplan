"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AuthButton } from "./auth-button";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/82 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-[clamp(20px,4vw,40px)]">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground"
          aria-label={SITE_NAME}
        >
          <BrandMark size={30} />
          <span className="font-display text-[18px] font-semibold tracking-[-0.01em]">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link, i) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                className={cn(
                  "relative py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent"
                    : "text-muted-foreground hover:text-accent",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA cluster */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <AuthButton />
          <Button size="sm" render={<Link href="/quiz" />}>
            Start planning
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
        </div>

        {/* Mobile cluster */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex h-9 w-9 items-center justify-center border border-border bg-transparent text-foreground transition-colors hover:border-foreground"
                />
              }
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background">
              <nav className="flex flex-col pt-10">
                {NAV_LINKS.map((link, i) => (
                  <Link
                    key={`${link.href}-${i}`}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-4 text-lg font-medium text-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  className="mt-6"
                  render={
                    <Link href="/quiz" onClick={() => setOpen(false)} />
                  }
                >
                  Start planning
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
                <div className="mt-4">
                  <AuthButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
