# Build Stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:18
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY .npmrc ./
RUN npm install --only=production
EXPOSE 8080
CMD ["npm", "start"]
