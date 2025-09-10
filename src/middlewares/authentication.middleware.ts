import type { NextFunction, Request, Response } from "express";
import { decodeToken, TokenEnum } from "../utils/tokens";
import { BadRequestException, ForbiddenException } from "../utils/response";
import { UserRoles } from "../database/models/user.model";

export const authentication = (tokenType = TokenEnum.access) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      throw new BadRequestException("Authorization header missing");
    }
    const { user, decoded } = await decodeToken({
      authorization: req.headers.authorization as string,
    });
    req.user = user 
    req.decoded = decoded;

    next();
  };
};
export const authorization = (accessRoles:UserRoles[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      throw new BadRequestException("Authorization header missing");
    }
    const { user, decoded } = await decodeToken({
      authorization: req.headers.authorization as string,
    });
    if(!accessRoles.includes(user.role)){
      throw new ForbiddenException("Unauthorized")
    }

    req.user = user;
    req.decoded = decoded;

    next();
  };
};