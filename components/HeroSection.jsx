"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HeroSection() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <section className="text-center space-y-6 pt-10">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
        💫 Bienvenue sur{" "}
        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent">
          Eloquia
        </span>
      </h1>

      <p className="text-lg text-white/80 max-w-2xl mx-auto">
        {user
          ? `Bonjour${user.displayName ? `, ${user.displayName}` : ""} 👋 ! Prêt à booster votre productivité avec l’IA ?`
          : "L’assistant IA qui révolutionne la manière dont vous analysez vos vidéos et audios."}
      </p>

      {user ? (
        <Button className="bg-gradient-to-r from-green-500 to-teal-500 px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition">
          <Link href="/transcription">🚀 Lancer la transcription</Link>
        </Button>
      ) : (
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition">
          <Link href="/register">✨ Créer un compte</Link>
        </Button>
      )}
    </section>
  );
}
