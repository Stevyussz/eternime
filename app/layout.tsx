import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Eternime - Watch Anime Free",
  description: "Your gateway to eternal anime entertainment.",
  manifest: "/manifest.json",
  themeColor: "#000000",
};

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/features/Navbar";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

function NavbarWrapper() {
  return <Navbar />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen selection:bg-brand-lime/30 selection:text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-20 pointer-events-none" />

          <NavbarWrapper />

          <main className="relative pt-24 min-h-screen">
            {children}
          </main>

          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
