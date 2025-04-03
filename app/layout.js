import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageTransitionProvider from "@/components/PageTransitionProvider"
import { Suspense } from "react"
import Loading from "./loading" // 🔥 très important

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Eloquia – Assistant Vidéo IA",
  description: "Transcrivez, résumez et discutez avec vos vidéos grâce à Eloquia.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col min-h-screen`}
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
  )
}
