# ⚙️ Image officielle Node.js 18
FROM node:18

# 📂 Crée un dossier app et copie le code
WORKDIR /app
COPY . .

# 📦 Installe ffmpeg + yt-dlp + dépendances Google Speech
RUN apt-get update && \
    apt-get install -y ffmpeg wget python3-pip && \
    wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    pip3 install google-cloud-speech

# 📦 Installe les dépendances Node.js
RUN npm install

# 🔐 Recrée google-stt.json à partir de la variable d'environnement encodée
RUN echo "$GOOGLE_CREDENTIALS_BASE64" | base64 -d > /app/google-stt.json

# 🛡️ Déclare le chemin vers les credentials Google
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-stt.json

# 🔧 Définit le mode production
ENV NODE_ENV=production

# 🛠 Build du projet Next.js
RUN npm run build

# 🌍 Port par défaut
EXPOSE 3000

# 🚀 Démarrage du serveur Next.js
CMD ["npm", "start"]
