FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start Next.js in dev mode
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
