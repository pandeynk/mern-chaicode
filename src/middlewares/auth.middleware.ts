// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { JwtService } from "../services/jwt.service";
import { UnauthorizedError } from "../utils/errors.util";

// Get JWT service from the container
const jwtService = container.get<JwtService>(TYPES.JwtService);

export const authenticate = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("No authorization header provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwtService.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedError("Invalid token");
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
