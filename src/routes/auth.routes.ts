// src/routes/auth.routes.ts
import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { loginRateLimiter } from "../middlewares/rateLimiter.middleware";
import {
  validate,
  ValidationSource,
} from "../middlewares/validation.middleware";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  loginRateLimiter,
  validate(registerValidation, ValidationSource.BODY),
  register
);

router.post(
  "/login",
  loginRateLimiter,
  validate(loginValidation, ValidationSource.BODY),
  login
);

export default router;
