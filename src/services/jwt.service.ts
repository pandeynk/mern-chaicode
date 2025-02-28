// src/services/jwt.service.ts
import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { appConfig } from "../configs/app";

@injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiry: string;

  constructor() {
    this.secret = appConfig.jwtSecret!;
    this.expiry = appConfig.jwtExpiry;
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiry,
    });
  }

  verifyToken(token: string): object | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      return typeof decoded === "object" && decoded !== null ? decoded : null;
    } catch {
      return null;
    }
  }
}
