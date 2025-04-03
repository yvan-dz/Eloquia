# ⚙️ Image Node.js officielle
FROM node:18

# 📂 Crée un dossier app et copie le code
WORKDIR /app
COPY . .

# 📦 Installe yt-dlp et ffmpeg
RUN apt-get update && apt-get install -y ffmpeg wget \
  && wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp

# 📦 Installe les dépendances
RUN npm install

# 🔒 Variables d'environnement chargées par Render
ENV NODE_ENV=production

# 🛠 Build du projet
RUN npm run build

# 🚀 Démarrage de Next.js
CMD ["npm", "start"]
