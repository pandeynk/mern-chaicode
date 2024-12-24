import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/bcrypt.util";
import { generateToken } from "../services/jwt.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user._id, email: user.email });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
