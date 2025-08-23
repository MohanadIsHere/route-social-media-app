import express from "express";
import helmet from "helmet";
import cors from "cors";
import { PORT } from "./config/env";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = PORT || 8303;

const bootstrap = () => {
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
  // middlewares
  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(limiter);

  app.listen(port, () => {
    console.log(`Social Media API is running on port ${port} 🚀 !`);
  });
};

export default bootstrap;
