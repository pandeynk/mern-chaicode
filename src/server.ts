import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";

dotenv.config();

console.log(
  "process.env.JWT_SECRET : " + JSON.stringify(process.env.JWT_SECRET)
);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Database connection failed:", error));

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
