import type { Metadata } from "next";
import { ResultsStream } from "@/components/quiz/results-stream";

export const metadata: Metadata = {
  title: "Your Recommendations",
  description: "AI-powered Japan destination recommendations based on your preferences.",
};

interface ResultsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;

  const quizParams = {
    travelStyle: params.style ?? "solo",
    interests: params.interests?.split(",") ?? [],
    season: params.season ?? "flexible",
    durationDays: Number(params.days) || 10,
    budget: params.budget ?? "moderate",
    pace: params.pace ?? "moderate",
    crowdTolerance: params.crowd ?? "medium",
    firstTime: params.firstTime === "true",
    mustVisit: params.mustVisit?.split(",").filter(Boolean) ?? [],
  };

  return <ResultsStream quizParams={quizParams} />;
}
