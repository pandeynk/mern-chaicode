import { AppDataSource } from "../ormconfig";
import logger from "./logger.util";

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Connected to MySQL with TypeORM");
  } catch (error) {
    logger.error(`Database connection failed: ${(error as Error).message}`);
    process.exit(1);
  }
};
