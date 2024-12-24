import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import { rateLimiter } from "./middlewares/rateLimiter.middleware";
import logger from "./utils/logger.util";
import { authenticate } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

// Middleware
app.use(express.json());
app.use(rateLimiter);

// Authenticate and Protect the Root Endpoint
app.get("/", authenticate, (req: Request, res: Response) => {
  res.send("Hello, authenticated user!");
});

// Routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL!)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) =>
    logger.error(`Database connection failed: ${error.message}`)
  );

// Start Server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
