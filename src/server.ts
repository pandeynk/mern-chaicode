import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import { generalRateLimiter } from "./middlewares/rateLimiter.middleware";
import logger from "./utils/logger.util";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import cacheMiddleware from "./middlewares/cache.middleware";
import { initializeDatabase } from "./utils/db.util";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 8080;

// Middleware
app.use(express.json());
app.use(generalRateLimiter);

// Cache Middleware Example
app.get("/api/data", cacheMiddleware, async (req, res) => {
  // Simulate a database call
  const data = {
    message: "This is the data from the database",
    timestamp: Date.now(),
  };
  res.status(200).json(data);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Production-Ready API");
});

initializeDatabase();

// Centralized Error Handler
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
