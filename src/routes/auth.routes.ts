import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { loginRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/register", loginRateLimiter, register);
router.post("/login", loginRateLimiter, login);

export default router;
