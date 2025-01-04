import dotenv from "dotenv";
dotenv.config();

export const cacheConfig = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};
