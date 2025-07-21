# Use official Node.js LTS image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure logs directory exists
RUN mkdir -p logs

EXPOSE 3000

CMD ["npm", "start"] 