FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server.js"]
