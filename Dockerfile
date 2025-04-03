# ⚙️ Image officielle Node.js 18
FROM node:18

# 📂 Dossier de travail
WORKDIR /app

# 📥 Copie des fichiers dans l'image
COPY . .

# 📦 Installation de ffmpeg, curl, python3-pip
RUN apt-get update && \
    apt-get install -y ffmpeg curl python3-pip && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    ln -s /usr/local/bin/yt-dlp /usr/bin/yt-dlp && \
    yt-dlp --version

# 📦 Installation de google-cloud-speech
RUN pip3 install google-cloud-speech

# 📦 Dépendances Node.js
RUN npm install

# 🛡️ Variables d’environnement
ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-stt.json

# 🔐 Crée le fichier de credentials si présent (optionnel si tu utilises base64)
# Tu peux aussi créer ce fichier au runtime avec Node.js si nécessaire

# 🛠️ Build Next.js
RUN npm run build

# 🌍 Port exposé
EXPOSE 3000

# 🚀 Lancement du serveur
CMD ["npm", "start"]
