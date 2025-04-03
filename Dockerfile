# ⚙️ Image officielle Node.js 18
FROM node:18

# 📂 Crée le dossier de travail et copie le code
WORKDIR /app
COPY . .

# 📦 Installe ffmpeg + curl + pip + yt-dlp + dépendances Google Cloud
RUN apt-get update && \
    apt-get install -y ffmpeg curl python3-pip && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/bin/yt-dlp && \
    chmod +x /usr/bin/yt-dlp && \
    yt-dlp --version && \
    pip3 install google-cloud-speech

# 📦 Installe les dépendances Node.js
RUN npm install

# 🛡️ Variables d’environnement
ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-stt.json

# 🔐 Génère google-stt.json à partir de la variable d’environnement (base64)
# ➕ Cette commande sera exécutée au runtime via le CMD (voir ci-dessous)

# 🛠 Build Next.js
RUN npm run build

# 🌍 Port exposé
EXPOSE 3000

# 🚀 Lancement + création dynamique de google-stt.json
CMD sh -c 'if [ -n "$GOOGLE_CREDENTIALS_BASE64" ]; then echo "$GOOGLE_CREDENTIALS_BASE64" | base64 -d > /app/google-stt.json; fi && npm start'
