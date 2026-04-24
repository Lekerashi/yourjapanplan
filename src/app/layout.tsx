import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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

// Runs before React hydrates so ink-mode users don't see a washi flash.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'ink' || stored === 'washi' ? stored : 'washi';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'ink') root.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="washi"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
