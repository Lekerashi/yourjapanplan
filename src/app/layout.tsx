import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Japan Trip Planner & Itinerary Builder`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Japan trip planner",
    "Japan itinerary builder",
    "Japan travel guide",
    "where to go in Japan",
    "Japan vacation planner",
    "JR Pass calculator",
    "Japan onsen guide",
    "Tokyo itinerary",
    "Kyoto itinerary",
    "Japan travel tips",
    "Japan for first timers",
    "Japan trip cost",
    "best places to visit in Japan",
    "Japan travel planning",
    "custom Japan itinerary",
  ],
  metadataBase: new URL("https://yourjapanplan.com"),
  openGraph: {
    title: `${SITE_NAME} — Japan Trip Planner & Itinerary Builder`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    url: "https://yourjapanplan.com",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Japan Trip Planner`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "https://yourjapanplan.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
