// src/ormconfig.ts
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
  // Connection pool configuration
  extra: {
    // Maximum number of connections in the pool
    connectionLimit: Number(dbConfig.connectionLimit) || 10,
    // Maximum time (ms) that a connection can be idle before being released
    queueLimit: 0,
    // Connection timeout in milliseconds
    connectTimeout: 60000,
    // The maximum time (ms) a connection can be idle before being released
    idleTimeout: