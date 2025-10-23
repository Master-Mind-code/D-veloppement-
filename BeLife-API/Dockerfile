# Image Node.js légère
FROM node:20-alpine
WORKDIR /workspace

# Copier package.json pour profiter du cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm ci --production

# Copier tout le code
COPY . .

# Exposer le port
EXPOSE 3500

# Commande de démarrage
CMD ["npm", "run", "start"]
