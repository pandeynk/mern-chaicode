import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST ?? "localhost", // Default to localhost if REDIS_HOST is not defined
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD ?? undefined, // Use password if set
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;
