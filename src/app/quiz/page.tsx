import type { Metadata } from "next";
import { QuizShell } from "@/components/quiz/quiz-shell";
import { JsonLd } from "@/components/seo/json-ld";

const SITE_URL = "https://www.yourjapanplan.com";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan Trip Quiz",
  url: `${SITE_URL}/quiz`,
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  description:
    "Six questions that turn your travel style, budget, and interests into a personalised Japan destination shortlist.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Quiz",
      item: `${SITE_URL}/quiz`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Plan My Trip",
  description:
    "Answer six questions and get a personalised Japan shortlist tuned to how you travel, who you're with, and the experiences that matter.",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <>
      <JsonLd data={[webAppSchema, breadcrumbSchema]} />
      <QuizShell />
    </>
  );
}
