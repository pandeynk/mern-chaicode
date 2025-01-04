import Redis from "ioredis";
import { cacheConfig } from "../configs/cache";

// Singleton Redis client instance
let redis: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redis) {
    redis = new Redis({
      host: cacheConfig.host ?? "localhost", // Default to localhost if not specified
      port: Number(cacheConfig.port) || 6379, // Default Redis port
      password: cacheConfig.password ?? undefined, // Use password if specified
    });

    redis.on("connect", () => {
      console.log("[Redis] Connected to Redis successfully");
    });

    redis.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
    });
  }
  return redis;
};

// Default export
export default getRedisClient;
