import { Request, Response } from "express";
import { register } from "../../src/controllers/auth.controller";
import { mockRepository } from "../setup";

describe("Auth Controller", () => {
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should register a new user", async () => {
    mockRepository.findOne.mockResolvedValueOnce(null); // Simulate user not existing
    mockRepository.save.mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
    }); // Simulate successful save

    req.body = { email: "test@example.com", password: "password123" };

    await register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });

  it("should fail to register an existing user", async () => {
    mockRepository.findOne.mockResolvedValueOnce({ email: "test@example.com" }); // Simulate user exists

    req.body = { email: "test@example.com", password: "password123" };

    await register(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });
});
