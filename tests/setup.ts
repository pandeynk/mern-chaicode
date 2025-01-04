import { AppDataSource } from "../src/ormconfig";
import Redis from "ioredis-mock";

// Mock the database repository
export const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

jest.mock("../src/ormconfig", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockRepository),
  },
}));

// Mock Redis
jest.mock("../src/utils/redis.util", () => {
  const MockRedis = new Redis();
  MockRedis.get = jest.fn(); // Mock Redis GET command
  MockRedis.set = jest.fn(); // Mock Redis SET command
  return MockRedis;
});
