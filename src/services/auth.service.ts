// src/services/auth.service.ts
import { injectable, inject } from "inversify";
import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/bcrypt.util";
import { TYPES } from "../di/types";
import { JwtService } from "./jwt.service";
import logger from "../utils/logger.util";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.JwtService) private jwtService: JwtService
  ) {}

  async register(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if the user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        logger.info(`Attempt to register existing email: ${email}`);
        return { success: false, message: "User already exists" };
      }

      // Hash the password and save the new user
      const hashedPassword = await hashPassword(password);
      await this.userRepository.create({ email, password: hashedPassword });

      logger.info(`User registered successfully: ${email}`);
      return { success: true, message: "User registered successfully" };
    } catch (error) {
      logger.error(`Error during registration: ${(error as Error).message}`);
      return { success: false, message: "Internal server error" };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; token?: string; message?: string }> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        logger.info(`Login failed for non-existent email: ${email}`);
        return { success: false, message: "Invalid credentials" };
      }

      // Validate the password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        logger.info(`Invalid password attempt for email: ${email}`);
        return { success: false, message: "Invalid credentials" };
      }

      // Generate a JWT token
      const token = this.jwtService.generateToken({
        id: user.id,
        email: user.email,
      });
      logger.info(`User logged in successfully: ${email}`);
      return { success: true, token };
    } catch (error) {
      logger.error(`Error during login: ${(error as Error).message}`);
      return { success: false, message: "Internal server error" };
    }
  }
}
