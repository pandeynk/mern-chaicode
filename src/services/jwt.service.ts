import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;
const expiry = process.env.JWT_EXPIRY ?? "1h";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret ?? process.env.JWT_SECRET, {
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
