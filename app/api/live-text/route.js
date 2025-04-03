import { NextResponse } from "next/server";

let latestText = ""; // mémoire temporaire

// GET pour récupérer la transcription en cours
export async function GET() {
  return NextResponse.json({ text: latestText });
}

// POST pour mettre à jour depuis le STT
export async function POST(req) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Texte manquant" }, { status: 400 });
  }

  latestText = text;
  return NextResponse.json({ success: true });
}
