import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { APP_NAME, PORT } from "./config/env";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import chalk from "chalk";
import authRouter from "./modules/auth/auth.controller";
import errorHandler from "./utils/response/error.response";

const app = express();
const port = PORT || 8303;

const bootstrap = (): void => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: {
      error: "Too many requests, please try again later.",
      status: 429,
    },
  });
  // Middlewares
  app.use(express.json(), helmet(), cors(), limiter, morgan("common"));

  // End Points
  app.use("/api/auth", authRouter);

  app.get("/", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: `Welcome To ${APP_NAME} Landing Page 👋 !` });
  });

  app.use(/(.*)/, (req: Request, res: Response) => {
    throw new Error(
      `Url ${req.originalUrl} not found, check your endpoint and the method used`,
      { cause: 404 }
    );
  });
  // error middleware
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(
      chalk.green.bold(`${APP_NAME} is running on port ${port} 🚀 !`)
    );
  });
};

export default bootstrap;
