// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import logger from "../utils/logger.util";

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  PARAM = "params",
  HEADER = "headers",
}

export const validate =
  (schema: Schema, source: ValidationSource = ValidationSource.BODY) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]/g, ""))
        .join(",");

      logger.warn(`Validation error: ${message}`);
      return res.status(400).json({ message });
    } catch (error) {
      logger.error(`Validation middleware error: ${(error as Error).message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
