import express from "express";
import { generalRateLimiter } from "./middlewares/rateLimiter.middleware";
import logger from "./utils/logger.util";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import cacheMiddleware from "./middlewares/cache.middleware";
import { initializeDatabase } from "./utils/db.util";
import { appConfig } from "./configs/app";
import { protectedRoutes, authRoutes, healthRoutes } from "./routes";
import { setupSwagger } from "./utils/swagger.util";

// Create the Express app
const app = express();
const port = appConfig.port;

// Middleware
app.use(express.json());
app.use(generalRateLimiter);

setupSwagger(app);

// Cache Middleware Example
app.get("/api/data", cacheMiddleware, async (req, res) => {
  const data = {
    message: "This is the data from the database",
    timestamp: Date.now(),
  };
  res.status(200).json(data);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", protectedRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Production-Ready API");
});

// Centralized Error Handler
app.use(errorHandler);

// Initialize the database and start the server (only in non-test environments)
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await initializeDatabase();
      logger.info("Database initialized successfully");

      app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      logger.error("Failed to initialize the database:", error);
      process.exit(1); // Exit the process if the database cannot be initialized
    }
  })();
}

// Export the app for testing
export default app;
