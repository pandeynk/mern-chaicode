// src/di/container.ts
import { Container } from "inversify";
import "reflect-metadata";
import { AuthService } from "../services/auth.service";
import { JwtService } from "../services/jwt.service";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/user.entity";
import { TYPES } from "./types";

const container = new Container();

// Repositories
container
  .bind(TYPES.UserRepository)
  .toDynamicValue(() => {
    return AppDataSource.getRepository(User);
  })
  .inSingletonScope();

// Services
container.bind<JwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
container
  .bind<AuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();

export { container };
