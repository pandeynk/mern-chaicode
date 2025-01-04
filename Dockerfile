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

# Install dependencies (all dependencies for dev, production-only for prod)
ARG DEV=false
RUN if [ "$DEV" = "true" ]; then npm install; else npm install --only=production; fi

# Expose the application port
EXPOSE 8080

# Add wait-for-it.sh
COPY wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Run wait-for-it.sh, migrations, and the app in the appropriate mode
CMD ["sh", "-c", "/usr/local/bin/wait-for-it.sh mysql 3306 -- npx typeorm migration:run -d ./dist/ormconfig.js && if [ \"$DEV\" = \"true\" ]; then npm run dev; else npm start; fi"]

