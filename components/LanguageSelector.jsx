"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "fr", label: "🇫🇷 Français" },
  { code: "en", label: "🇬🇧 English" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "es", label: "🇪🇸 Español" }
];

export default function LanguageSelector({ currentLang, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center space-y-2 transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 px-5 py-2 text-white text-sm rounded-full border border-white/20 backdrop-blur hover:bg-white/20 transition shadow"
      >
        <span>{languages.find(l => l.code === currentLang)?.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="flex flex-col w-40 rounded-xl bg-[#1c1b22] shadow-lg ring-1 ring-white/10 backdrop-blur divide-y divide-white/10 overflow-hidden">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
              }}
              className="px-4 py-2 text-sm text-white hover:bg-fuchsia-700/30 text-left transition"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
