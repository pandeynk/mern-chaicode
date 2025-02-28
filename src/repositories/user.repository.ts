// src/repositories/user.repository.ts
import { injectable } from "inversify";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../ormconfig";
import { DatabaseError } from "../utils/errors.util";

@injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error) {
      throw new DatabaseError(
        `Error finding user by email: ${(error as Error).message}`
      );
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new DatabaseError(
        `Error finding user by ID: ${(error as Error).message}`
      );
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repository.create(userData);
      return await this.repository.save(user);
    } catch (error) {
      throw new DatabaseError(
        `Error creating user: ${(error as Error).message}`
      );
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      await this.repository.update(id, userData);
      return this.findById(id);
    } catch (error) {
      throw new DatabaseError(
        `Error updating user: ${(error as Error).message}`
      );
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected !== undefined && result.affected > 0;
    } catch (error) {
      throw new DatabaseError(
        `Error deleting user: ${(error as Error).message}`
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<[User[], number]> {
    try {
      const skip = (page - 1) * limit;
      return await this.repository.findAndCount({
        skip,
        take: limit,
        order: {
          createdAt: "DESC",
        },
      });
    } catch (error) {
      throw new DatabaseError(
        `Error finding users: ${(error as Error).message}`
      );
    }
  }
}
