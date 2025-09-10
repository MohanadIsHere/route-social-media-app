import type { JwtPayload } from "jsonwebtoken";
import type { HydratedUserDoc } from "../../database/models/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: HydratedUserDoc;
    decoded?: JwtPayload;
  }
}
