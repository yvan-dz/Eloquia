"use client";

import Link from "next/link";
import {
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false); // ferme le menu mobile après déconnexion
  };

  return (
    <header className="w-full backdrop-blur-md bg-white/5 dark:bg-black/30 border-b border-white/10 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 text-transparent bg-clip-text"
        >
          <Sparkles className="w-5 h-5 text-pink-300" />
          Eloquia
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {menuLinks}
          {mounted && (
            <>
              {user ? (
                <>
                  <Link
                    href="/user"
                    className="flex items-center gap-1 text-white/80 hover:text-white transition"
                  >
                    <User className="w-4 h-4" />
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-white/80 hover:text-white transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 text-white/80 hover:text-white transition"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
              )}
              {themeToggle(theme, setTheme)}
            </>
          )}
        </nav>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center gap-3">
          {mounted && themeToggle(theme, setTheme)}
          <button
            onClick={() => setOpen(!open)}
            className="text-white/80 hover:text-white transition"
            aria-label="Ouvrir le menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-black/40 backdrop-blur border-t border-white/10 px-6 pb-6 pt-4 text-sm font-medium space-y-4"
          >
            <div className="space-y-3">{menuLinks}</div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/user"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition"
                    onClick={() => setOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition"
                  onClick={() => setOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const menuLinks = (
  <>
    <Link
      href="/transcription"
      className="block text-white/80 hover:text-white transition"
    >
      Transcription Vidéo
    </Link>
    <Link
      href="/live-transcription"
      className="block text-white/80 hover:text-white transition"
    >
      Transcription Live
    </Link>
    <Link
      href="/pricing"
      className="block text-white/80 hover:text-white transition"
    >
      Tarifs
    </Link>
    <Link
      href="/faq"
      className="block text-white/80 hover:text-white transition"
    >
      FAQ
    </Link>
    <Link
      href="/contact"
      className="block text-white/80 hover:text-white transition"
    >
      Contact
    </Link>
  </>
)


function themeToggle(theme, setTheme) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-white/80 hover:text-white transition"
      aria-label="Changer de thème"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
