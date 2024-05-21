FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json to working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to working directory
COPY . .

# Build
RUN npm run build

# Install a simple HTTP server for static files
RUN npm install -g serve

# Expose Port
EXPOSE 3000

# Define commands
CMD ["serve", "-s", "build"]
