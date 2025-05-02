import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, lang = "fr", history = [] } = await req.json();

    if (!prompt) {
      console.warn("[ASK] ❌ Prompt manquant !");
      return NextResponse.json({ error: "Texte manquant" }, { status: 400 });
    }

    console.log("[ASK] 🧠 Envoi à Gemini :", prompt, "| Langue :", lang);

    // Langue cible lisible
    const langLabelMap = {
      fr: "le français",
      en: "English",
      de: "Deutsch",
      es: "Español",
    };
    const langLabel = langLabelMap[lang] || "la langue cible";

    // Prompt système personnalisé
    const systemPrompt = `Tu es une IA qui accompagne un utilisateur dans l’apprentissage des langues.

Réponds toujours dans la langue cible : ${langLabel}.
Utilise des phrases naturelles, comme à l’oral.
L'utilisateur est apprenant : tu corriges ses fautes rapidement et de facon bienveillante. si il fait des fautes visibles, corrige en une phrase et continue a parler normalement.
Pas de disclaimer. Pas de liste. Pas de syntaxe technique.
Sois bref (2 à 5 phrases), chaleureux et fluide.`;

    // Historique de conversation (max 6)
    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const contents = [
      { role: "model", parts: [{ text: systemPrompt }] },
      ...formattedHistory,
      { role: "user", parts: [{ text: prompt }] },
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("[ASK] ❌ Erreur Gemini :", geminiData);
      return NextResponse.json({ error: geminiData }, { status: geminiRes.status });
    }

    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Je n’ai pas compris.";

    console.log("[ASK] ✅ Réponse Gemini :", reply);

    // Sélection voix TTS
    const voices = {
      fr: "fr-FR-Chirp3-HD-Leda",
      en: "en-US-Chirp3-HD-Leda",
      de: "de-DE-Chirp3-HD-Leda",
      es: "es-ES-Chirp3-HD-Leda",
    };
    const selectedVoice = voices[lang] || voices["fr"];
    const languageCode = selectedVoice.split("-").slice(0, 2).join("-");

    const ttsRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: reply },
          voice: {
            languageCode,
            name: selectedVoice,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.0,
          },
        }),
      }
    );

    const ttsData = await ttsRes.json();

    if (!ttsRes.ok) {
      console.error("[ASK] ❌ Erreur TTS :", ttsData);
      return NextResponse.json({ reply, audio: null, error: "TTS failed" }, { status: 200 });
    }

    console.log("[ASK] 🔊 Audio généré avec succès");

    return NextResponse.json({
      reply,
      audio: ttsData.audioContent,
    });

  } catch (error) {
    console.error("[ASK] ❌ Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 });
  }
}
