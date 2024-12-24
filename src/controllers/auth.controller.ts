import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/bcrypt.util";
import { generateToken } from "../services/jwt.service";
import logger from "../utils/logger.util";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator";

export const register = async (req: Request, res: Response) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.info(`Attempt to register existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    logger.info(`User registered successfully: ${email}`);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(
      `Internal server error during registration: ${(error as Error).message}`
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.info(`Login failed for non-existent email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      logger.info(`Invalid password attempt for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, email: user.email });
    logger.info(`User logged in successfully: ${email}`);
    return res.status(200).json({ token });
  } catch (error) {
    logger.error(
      `Internal server error during login: ${(error as Error).message}`
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
