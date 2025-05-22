import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import { Suspense } from "react";
import Loading from "./loading"; // 🔥 très important

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Eloquia – AI Language & Video Assistant",
  description: "Transcribe videos, chat with AI, and test your language level in speaking, listening, reading and writing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased flex flex-col min-h-screen
          bg-white text-black transition-colors duration-300
          dark:bg-gradient-to-br dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] dark:text-white
        `}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <PageTransitionProvider>
            <main className="flex-1">
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </main>
          </PageTransitionProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
