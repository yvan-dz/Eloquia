"use client"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/20 bg-[#0f0c29] text-sm text-white/70 shadow-inner">

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        
        {/* © Texte gauche */}
        <div className="text-center md:text-left text-white/60 text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-white">Eloquia</span>. Tous droits réservés.
        </div>

        {/* Liens droits */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
          <FooterLink href="/about" label="À propos" />
          <FooterLink href="/mentions-legales" label="Mentions légales" />
          <FooterLink href="/confidentialite" label="Confidentialité" />
          <FooterLink href="/faq" label="FAQ" />
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label }) {
  return (
    <Link
      href={href}
      className="hover:text-white transition duration-200 underline-offset-2 hover:underline"
    >
      {label}
    </Link>
  )
}
