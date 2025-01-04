# Build Stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:18
WORKDIR /app

# Copy built application and package files
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

# Expose the application port
EXPOSE 8080

# Add wait-for-it.sh
COPY wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Run wait-for-it.sh, migrations, and then start the app
CMD ["sh", "-c", "/usr/local/bin/wait-for-it.sh mysql 3306 -- npx typeorm migration:run -d ./dist/ormconfig.js && npm start"]
