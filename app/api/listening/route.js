import { NextResponse } from "next/server";

function cleanTextForTTS(text) {
  return text
    .replace(/[*_`~>#|]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4500); // sécurité max caractères TTS
}

const voices = {
  fr: "fr-FR-Chirp3-HD-Leda",
  en: "en-US-Chirp3-HD-Leda",
  de: "de-DE-Chirp3-HD-Aoede",
  es: "es-ES-Chirp3-HD-Aoede",
};

const langCodes = {
  fr: "fr-FR",
  en: "en-US",
  de: "de-DE",
  es: "es-ES",
};

function getParamsForLevel(level) {
  switch (level) {
    case "A1": return { words: 60, questions: 4 };
    case "A2": return { words: 90, questions: 6 };
    case "B1": return { words: 150, questions: 9 };
    case "B2": return { words: 200, questions: 11 };
    case "C1": return { words: 270, questions: 15 };
    case "C2": return { words: 400, questions: 20 };
    default: return { words: 100, questions: 4 };
  }
}

export async function POST(req) {
  try {
    const { language, level } = await req.json();

    if (!language || !level) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const langKey = language.toLowerCase().slice(0, 2);
    const selectedVoice = voices[langKey] || voices["en"];
    const langCode = langCodes[langKey] || "en-US";
    const { words, questions: nbQuestions } = getParamsForLevel(level);

const prompt = `
You are a CEFR language examiner. your are a woman.

1. Write a spoken monologue in ${language} for level ${level}.
   - The passage should be natural, realistic and adapted for listening skills.
   - The monologue should be about ${words} words long (maximum 500 words).

2. Then generate exactly ${nbQuestions} multiple-choice comprehension questions.
   - Each question must include exactly 3 options (A, B, C), written like: "A. Paris", "B. London", "C. New York"
   - The "correct" field must be the **full matching string** from the options array (not just "A" or "B")
   - Example: If options are ["A. Cat", "B. Dog", "C. Fish"], then correct = "B. Dog"
   - Verify that "correct" exactly matches one of the options

3. Return ONLY valid JSON in this exact structure (no markdown, no explanation, no formatting):

{
  "text": "string",
  "questions": [
    { "q": "string", "options": ["string", "string", "string"], "correct": "string" }
  ]
}

⚠️ Do not include any intro, comment or formatting outside this JSON block.
Ensure the JSON is directly parsable and accurate.
`;


    // 🌐 Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    let raw = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    raw = raw.replace(/```json|```/g, "").replace(/[“”]/g, '"').trim();
    const parsed = JSON.parse(raw.slice(raw.indexOf("{")));
    const { text: spokenText, questions } = parsed;

    const cleanedText = cleanTextForTTS(spokenText);

    // 🎧 TTS via REST API
    const ttsRes = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: cleanedText },
          voice: {
            name: selectedVoice,
            languageCode: langCode,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate:
              level === "A1" || level === "A2"
                ? 0.9
                : level === "C1" || level === "C2"
                ? 1.0
                : 1.0,
          },
        }),
      }
    );

    const ttsData = await ttsRes.json();

    if (!ttsData.audioContent) {
      console.error("❌ TTS error:", ttsData);
      return NextResponse.json({ error: "TTS failed", details: ttsData }, { status: 500 });
    }

    return NextResponse.json({
      audio: ttsData.audioContent, // base64
      questions,
      text: spokenText, // affiché à la fin
    });

  } catch (error) {
    console.error("❌ Listening route error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
