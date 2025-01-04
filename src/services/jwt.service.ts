import jwt from "jsonwebtoken";
import { appConfig } from "../configs/app";

const secret = appConfig.jwtSecret!;
const expiry = appConfig.jwtExpiry;

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiry,
  });
};

export const verifyToken = (token: string): object | null => {
  try {
    const decoded = jwt.verify(token, secret);
    return typeof decoded === "object" && decoded !== null ? decoded : null;
  } catch {
    return null;
  }
};
