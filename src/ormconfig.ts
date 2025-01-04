import { DataSource } from "typeorm";

// Migrations
import { CreateUsersTable1735138375286 } from "./migrations/1735138375286-CreateUsersTable";

// Entities
import { User } from "./entities/user.entity";

import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging:
    process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"],
  migrations: [CreateUsersTable1735138375286],
  entities: [User],
});
