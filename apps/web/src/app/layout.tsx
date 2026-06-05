import type { Metadata } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// EB Garamond carries Cyrillic glyphs — keeps body text working for the future `ua` locale.
const ebGaramond = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Tarot AI — Ask the Cards",
  description: "Ask a question and let the cards reveal their answer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
