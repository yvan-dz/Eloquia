import { NextResponse } from "next/server";
import speech from "@google-cloud/speech";
import { Buffer } from "buffer";

// Client Google Cloud avec la clé stockée localement
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const sttClient = new speech.SpeechClient({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    },
});


export async function POST(req) {
    try {
        const { audioContent, lang = "fr" } = await req.json();

        if (!audioContent) {
            return NextResponse.json({ error: "Contenu audio manquant" }, { status: 400 });
        }

        // Mapping des langues vers leurs codes STT
        const langCodes = {
            fr: "fr-FR",
            en: "en-US",
            de: "de-DE",
            es: "es-ES",
        };
        const languageCode = langCodes[lang] || "fr-FR";

        console.log("[STT] 🎧 Langue utilisée :", languageCode);

        const audioBytes = Buffer.from(audioContent, "base64");

        const [response] = await sttClient.recognize({
            audio: { content: audioBytes.toString("base64") },
            config: {
                encoding: "WEBM_OPUS",
                sampleRateHertz: 48000,
                languageCode,
            },
        });

        const transcription = response.results
            .map((r) => r.alternatives[0]?.transcript)
            .filter(Boolean)
            .join("\n")
            .trim();

        return NextResponse.json({ text: transcription || "..." });

    } catch (err) {
        console.error("Erreur STT :", err);
        return NextResponse.json({ error: "STT échoué", details: err.message }, { status: 500 });
    }
}
