import request from "supertest";
import app from "../../src/server";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should fail to register an existing user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});
