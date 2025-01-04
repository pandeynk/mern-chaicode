import { Request, Response, NextFunction } from "express";

import getRedisClient from "../utils/redis.util";

const redis = getRedisClient();

const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheKey = req.originalUrl;

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${cacheKey}`);
    const sendResponse = res.send;
    res.send = (body): Response => {
      redis.set(cacheKey, JSON.stringify(body), "EX", 3600); // Cache for 1 hour
      return sendResponse.call(res, body);
    };

    next();
  } catch (error) {
    console.error("Redis error:", error);
    next(); // Proceed even if Redis fails
  }
};

export default cacheMiddleware;
