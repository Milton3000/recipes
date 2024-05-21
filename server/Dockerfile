
FROM node:18


WORKDIR /app

# Kopiera package.json och package-lock.json till working directory
COPY package*.json ./

# Installera dependencies
RUN npm install

# Kopiera resten av applikationskoden till working directory
COPY . .

# Expose Port
EXPOSE 3001

# Definera commands
CMD ["npm", "start"]
