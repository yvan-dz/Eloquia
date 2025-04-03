// app/api/contact/route.js
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY) // PAS PUBLIC

export async function POST(req) {
  try {
    const body = await req.json()

    const { name, email, message } = body

    await resend.emails.send({
      from: "Eloquia <onboarding@resend.dev>",
      to: "yvandzefak1@gmail.com", // 👈 ton vrai mail ici
      subject: `📨 Nouveau message de ${name}`,
      html: `
        <h2>📩 Message depuis le site Eloquia</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br/>${message}</p>
      `,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error("Erreur Resend :", err)
    return Response.json({ error: "Erreur d'envoi de mail" }, { status: 500 })
  }
}
