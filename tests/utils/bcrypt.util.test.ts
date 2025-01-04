import { hashPassword, comparePassword } from "../../src/utils/bcrypt.util";

describe("Bcrypt Utility", () => {
  it("should hash a password", async () => {
    const password = "password123";
    const hashed = await hashPassword(password);
    expect(hashed).not.toBe(password);
  });

  it("should validate a correct password", async () => {
    const password = "password123";
    const hashed = await hashPassword(password);
    const isValid = await comparePassword(password, hashed);
    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "password123";
    const hashed = await hashPassword(password);
    const isValid = await comparePassword("wrongpassword", hashed);
    expect(isValid).toBe(false);
  });
});
