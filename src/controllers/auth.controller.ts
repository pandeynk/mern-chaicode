import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/user.entity";
import { hashPassword, comparePassword } from "../utils/bcrypt.util";
import { generateToken } from "../services";
import logger from "../utils/logger.util";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      logger.info(`Attempt to register existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password and save the new user
    const hashedPassword = await hashPassword(password);
    const newUser = userRepository.create({ email, password: hashedPassword });
    await userRepository.save(newUser);

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

    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      logger.info(`Login failed for non-existent email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate the password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      logger.info(`Invalid password attempt for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = generateToken({ id: user.id, email: user.email });
    logger.info(`User logged in successfully: ${email}`);
    return res.status(200).json({ token });
  } catch (error) {
    logger.error(
      `Internal server error during login: ${(error as Error).message}`
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
