import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/jwt.service";

export const authenticate = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid token" });

  req.user = decoded;
  next();
};
