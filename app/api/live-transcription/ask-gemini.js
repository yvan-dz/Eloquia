import { NextResponse } from "next/server";

export const runtime = "nodejs";

// mémoire locale pour la session
const liveChats = new Map();

export async function POST(req) {
  try {
    const { chatId, role, message, transcription } = await req.json();

    if (!chatId || !message || !role) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    if (!liveChats.has(chatId)) {
      if (!transcription) {
        return NextResponse.json({ error: "Transcription requise" }, { status: 400 });
      }

      liveChats.set(chatId, [
        {
          role: "user",
          parts: [{ text: `Voici ce que j'ai dit à l'oral :\n\n${transcription}` }],
        },
      ]);
    }

    const history = liveChats.get(chatId);
    history.push({ role, parts: [{ text: message }] });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    });

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune réponse";
    history.push({ role: "model", parts: [{ text: reply }] });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Erreur Gemini :", error);
    return NextResponse.json({ error: "Erreur serveur Gemini", details: error.message }, { status: 500 });
  }
}
