import { NextResponse } from "next/server";

export const runtime = "nodejs";

// 🧠 Mémoire temporaire par session
const chatMemory = new Map();

export async function POST(req) {
  try {
    const { chatId, role, message, transcription } = await req.json();

    if (!chatId || !message || !role) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    // 🧠 Démarrer une session avec la transcription
    if (!chatMemory.has(chatId)) {
      if (!transcription) {
        return NextResponse.json({ error: "Transcription requise pour démarrer une session" }, { status: 400 });
      }

      chatMemory.set(chatId, [
        {
          role: "user",
          parts: { text: `Voici le texte issu de l'audio :\n\n${transcription}` },
        },
      ]);
    }

    // ➕ Ajouter le nouveau message utilisateur
    const history = chatMemory.get(chatId);
    history.push({
      role,
      parts: { text: message },
    });

    // 🔁 Appel Gemini avec tout l’historique
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Gemini API :", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse.";
    
    // ➕ Sauvegarder la réponse de l’IA
    history.push({
      role: "model",
      parts: { text: reply },
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
