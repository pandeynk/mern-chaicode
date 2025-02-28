import { Request, Response } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthService } from "../services/auth.service";
import logger from "../utils/logger.util";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator";

const authService = container.get<AuthService>(TYPES.AuthService);

export const register = async (req: Request, res: Response) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;
  const result = await authService.register(email, password);

  if (result.success) {
    return res.status(201).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;
  const result = await authService.login(email, password);

  if (result.success) {
    return res.status(200).json({ token: result.token });
  } else {
    return res.status(400).json({ message: result.message });
  }
};
