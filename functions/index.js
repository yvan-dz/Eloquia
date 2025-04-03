const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const db = admin.firestore(); // ✅ important !

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tonemail@gmail.com",
    pass: "tonMotDePasseApplication", // pas ton vrai mot de passe Gmail !
  },
});

exports.sendContactEmail = functions.firestore
  .document("messages/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const mailOptions = {
      from: "Eloquia <tonemail@gmail.com>",
      to: "tonemail@gmail.com",
      subject: `📬 Nouveau message de ${data.name}`,
      text: `
Nom: ${data.name}
Email: ${data.email}
Message: ${data.message}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email envoyé !");
    } catch (error) {
      console.error("❌ Erreur d’envoi :", error);
    }
  });
