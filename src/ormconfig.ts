import { DataSource } from "typeorm";

// Migrations
import { CreateUsersTable1735138375286 } from "./migrations/1735138375286-CreateUsersTable";

// Entities
import { User } from "./entities/user.entity";

import { dbConfig } from "./configs/db";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: dbConfig.host,
  port: Number(dbConfig.port),
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: false,
  logging:
    process.env.NODE_ENV === "production" ? ["error"] : ["query", "error"],
  migrations: [CreateUsersTable1735138375286],
  entities: [User],
});
