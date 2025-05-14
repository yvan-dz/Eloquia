import { NextResponse } from "next/server";

// 🔧 Nettoyage du texte avant TTS
function cleanTextForTTS(text) {
  return text
    .replace(/[*_`~>#|]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req) {
  try {
    const { prompt, lang = "fr", history = [] } = await req.json();

    if (!prompt) {
      console.warn("[ASK] ❌ Prompt manquant !");
      return NextResponse.json({ error: "Missing input text." }, { status: 400 });
    }

    console.log("[ASK] 🔹 Lang:", lang);
    console.log("[ASK] 🧠 Prompt reçu :", prompt);
    console.log("[ASK] 🕓 Historique précédent :", history.length, "messages");

    const langLabelMap = {
      fr: "le français",
      en: "English",
      de: "Deutsch",
      es: "Español",
    };
    const langLabel = langLabelMap[lang] || "la langue cible";

    const systemPrompt = `Tu es une IA qui accompagne un utilisateur dans l’apprentissage des langues.

Réponds toujours dans la langue cible : ${langLabel}.
Utilise des phrases naturelles, comme à l’oral.
L'utilisateur est apprenant : tu corriges ses fautes rapidement et de facon bienveillante. si il fait des fautes visibles, corrige en une phrase et continue a parler normalement.
Pas de disclaimer. Pas de liste. Pas de syntaxe technique.
Sois bref (2 à 5 phrases), chaleureux et fluide.`;

    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const contents = [
      { role: "model", parts: [{ text: systemPrompt }] },
      ...formattedHistory,
      { role: "user", parts: [{ text: prompt }] },
    ];

    console.log("[ASK] 📤 Envoi à Gemini...");

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
      return NextResponse.json({ error: "AI processing failed." }, { status: geminiRes.status });
    }

    const rawReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "I didn’t understand.";
    const reply = cleanTextForTTS(rawReply);

    console.log("[ASK] ✅ Réponse AI (brute) :", JSON.stringify(rawReply));
    console.log("[ASK] 🧼 Réponse nettoyée :", reply);

    const voices = {
      fr: "fr-FR-Chirp3-HD-Leda",
      en: "en-US-Chirp3-HD-Leda",
      de: "de-DE-Chirp3-HD-Leda",
      es: "es-ES-Chirp3-HD-Leda",
    };
    const selectedVoice = voices[lang] || voices["fr"];
    const languageCode = selectedVoice.split("-").slice(0, 2).join("-");

    console.log("[ASK] 🔊 Envoi au TTS (voix :", selectedVoice + ")...");

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
      console.error("[ASK] ❌ TTS error :", ttsData);
      return NextResponse.json({ reply, audio: null, error: "Voice generation failed." }, { status: 200 });
    }

    console.log("[ASK] ✅ TTS terminé. Audio généré.");

    return NextResponse.json({
      reply,
      audio: ttsData.audioContent,
    });

  } catch (error) {
    console.error("[ASK] ❌ Server error :", error);
    return NextResponse.json({ error: "Internal server error.", details: error.message }, { status: 500 });
  }
}
