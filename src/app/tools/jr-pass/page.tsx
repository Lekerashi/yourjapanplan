import type { Metadata } from "next";
import { JRPassCalculator } from "@/components/tools/jr-pass-calculator";

export const metadata: Metadata = {
  title: "JR Pass Calculator 2026 — Is the Japan Rail Pass Worth It?",
  description:
    "Calculate if the Japan Rail Pass is worth it for your trip. Compare Shinkansen ticket prices vs JR Pass costs for routes like Tokyo to Osaka, Kyoto, Hiroshima, and more.",
  keywords: ["JR Pass calculator", "Japan Rail Pass worth it", "JR Pass 2026 price", "Shinkansen cost calculator", "Japan train pass"],
};

export default function JRPassPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          JR Pass Calculator
        </h1>
        <p className="mt-3 text-muted-foreground">
          Add your planned train routes to see if the Japan Rail Pass saves you
          money.
        </p>
      </div>

      <div className="mt-8">
        <JRPassCalculator />
      </div>
    </div>
  );
}
