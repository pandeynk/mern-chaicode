import mongoose, { Error } from "mongoose";
import logger from "./logger.util";

const connectToDatabase = async () => {
  try {
    const DB_URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongo:27017/${process.env.DB_DATABASE}?authSource=admin`;

    await mongoose.connect(DB_URL);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error(`Database connection failed: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectToDatabase;
