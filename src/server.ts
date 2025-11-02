import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { APP_NAME, PORT } from "./config/env";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import chalk from "chalk";
import { errorMiddleware } from "./middlewares";
import { BadRequestException, NotFoundException } from "./utils/response";
import connectToDatabase from "./database/connection.db";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { getFile } from "./utils/aws/S3";
import { userRouter, authRouter, postRouter, initializeIo, chatRouter } from "./modules";
const createWriteStreamPipeline = promisify(pipeline);

const app = express();
const port = PORT || 8303;

const bootstrap = async (): Promise<void> => {
  // Database Connection
  await connectToDatabase();
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
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
  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/chat", chatRouter);

  app.get("/", (req: Request, res: Response) => {
    return res
      .status(200)
      .json({ message: `Welcome To ${APP_NAME} Landing Page 👋 ! ` });
  });
  app.get(
    "/upload/*path",
    async (req: Request, res: Response): Promise<void> => {
      const {
        fileName,
        download = "false",
      }: { fileName?: string; download?: string } = req.query;

      const { path } = req.params as unknown as { path: string[] };
      const Key = path.join("/");

      const s3Response = await getFile({ Key });
      if (!s3Response?.Body)
        throw new BadRequestException("Fail to fetch this asset");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader(
        "Content-Type",
        `${s3Response.ContentType || "application/octet-stream"}`
      );
      if (download == "true") {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName || Key.split("/").pop()}"`
        );
      }
      return await createWriteStreamPipeline(
        s3Response.Body as NodeJS.ReadableStream,
        res
      );
    }
  );
  app.use(/(.*)/, (req: Request, res: Response) => {
    throw new NotFoundException(
      `Url ${req.originalUrl} not found, check your endpoint and the method used`
    );
  });

  // error middleware
  app.use(errorMiddleware);

  const httpServer = app.listen(port, () => {
    console.log(
      chalk.green.bold(`${APP_NAME} is running on port ${port} 🚀 !`)
    );
  });
  initializeIo(httpServer);
  
};

export default bootstrap;
