"use client"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 backdrop-blur bg-white/5 text-sm text-white/70">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} <span className="font-semibold text-white">Eloquia</span>. Tous droits réservés.
        </p>
        <div className="flex flex-wrap justify-center sm:justify-end gap-4">
          <Link href="/about" className="hover:text-white transition duration-200">
            À propos
          </Link>
          <Link href="/mentions-legales" className="hover:text-white transition duration-200">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-white transition duration-200">
            Confidentialité
          </Link>
        </div>
      </div>
    </footer>
  )
}
