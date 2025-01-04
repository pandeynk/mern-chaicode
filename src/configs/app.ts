import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY ?? "1h",
};
