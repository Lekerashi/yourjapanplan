import type { Metadata } from "next";
import { QuizShell } from "@/components/quiz/quiz-shell";

export const metadata: Metadata = {
  title: "Plan My Trip",
  description:
    "Answer a few questions and get personalized Japan destination recommendations powered by AI.",
};

export default function QuizPage() {
  return <QuizShell />;
}
