import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eternime — Watch Anime Free",
    template: "%s — Eternime",
  },
  description: "Your gateway to eternal anime entertainment. Watch anime in HD for free.",
  manifest: "/manifest.json",
  keywords: ["anime", "watch anime", "streaming", "free anime", "eternime"],
  authors: [{ name: "Eternime" }],
  openGraph: {
    siteName: "Eternime",
    type: "website",
  },
};

/** Viewport export — replaces deprecated themeColor in metadata */
export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark light",
};

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/features/Navbar";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen selection:bg-brand-lime/30 selection:text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Subtle grid background pattern */}
          <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-20 pointer-events-none" />

          <Navbar />

          <main className="relative pt-24 min-h-screen">
            {children}
          </main>

          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
