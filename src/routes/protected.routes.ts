import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const protectedRouter = Router();

protectedRouter.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req?.user,
  });
});

export default protectedRouter;
