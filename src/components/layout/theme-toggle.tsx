"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Theme = "washi" | "ink";

const THEME_EVENT = "yjp:theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "ink" ? "ink" : "washi";
}

function getServerSnapshot(): Theme {
  return "washi";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "ink");
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isInk = theme === "ink";

  const toggle = () => {
    applyTheme(isInk ? "washi" : "ink");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isInk ? "Switch to washi (light) mode" : "Switch to ink (dark) mode"}
      aria-pressed={isInk}
      title={isInk ? "Washi (light)" : "Ink night (dark)"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center border border-border bg-transparent text-foreground transition-colors hover:border-foreground hover:text-accent",
        className,
      )}
      suppressHydrationWarning
    >
      {isInk ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
