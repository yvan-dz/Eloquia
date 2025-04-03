# ⚙️ Image officielle Node.js 18
FROM node:18

# 📂 Crée un dossier app et copie le code
WORKDIR /app
COPY . .

# 📦 Installe ffmpeg + curl + pip + yt-dlp + dépendances Google Speech
RUN apt-get update && \
    apt-get install -y ffmpeg curl python3-pip && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    ln -s /usr/local/bin/yt-dlp /usr/bin/yt-dlp && \
    which yt-dlp && yt-dlp --version && \
    pip3 install google-cloud-speech

# 📦 Installe les dépendances Node.js
RUN npm install

# 🛡️ Variables d’environnement (fichier STT)
ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-stt.json

# 🔐 Crée google-stt.json à partir de la variable base64
RUN if [ -n "$GOOGLE_CREDENTIALS_BASE64" ]; then \
    echo "$GOOGLE_CREDENTIALS_BASE64" | base64 -d > /app/google-stt.json; \
    fi

# 🛠 Build du projet Next.js
RUN npm run build

# 🌍 Port exposé
EXPOSE 3000

# 🚀 Lancement du serveur Next.js
CMD ["npm", "start"]
