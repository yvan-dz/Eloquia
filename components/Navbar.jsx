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

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false); // ferme le menu mobile après déconnexion
  };

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } backdrop-blur-md bg-white/5 dark:bg-black/30 border-b border-white/10 shadow-lg`}
    >
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
          {menuLinks(closeMenu)}
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
            <div className="space-y-3">{menuLinks(closeMenu)}</div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/user"
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition"
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
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition"
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

// ⬇ menuLinks reçoit maintenant closeMenu pour fermer automatiquement
const menuLinks = (close) => (
  <>
    <Link
      href="/transcription"
      onClick={close}
      className="block text-white/80 hover:text-white transition"
    >
      Transcription Vidéo
    </Link>
    <Link
      href="/live-transcription"
      onClick={close}
      className="block text-white/80 hover:text-white transition"
    >
      Transcription Live
    </Link>
    <Link
      href="/pricing"
      onClick={close}
      className="block text-white/80 hover:text-white transition"
    >
      Tarifs
    </Link>
    <Link
      href="/faq"
      onClick={close}
      className="block text-white/80 hover:text-white transition"
    >
      FAQ
    </Link>
    <Link
      href="/contact"
      onClick={close}
      className="block text-white/80 hover:text-white transition"
    >
      Contact
    </Link>
  </>
);

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
