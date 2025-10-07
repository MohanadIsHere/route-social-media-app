import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodType } from "zod";
import { BadRequestException } from "../utils/response";
type KeyReqType = keyof Request;
type SchemaType = Partial<Record<KeyReqType, ZodType>>;
export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction => {
    const validationErrors: Array<{
      key: KeyReqType;
      issues: Array<{
        message: string;
        path: (string | number | symbol | undefined)[];
      }>;
    }> = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      if (!schema[key]) continue;
      if(req.file){
        req.body.attachment = req.file
      }
      if(req.files){
        
        req.body.attachments = req.files
      }

      const { error, success } = schema[key].safeParse(req[key]);
      if (!success) {
        const errors = error as unknown as ZodError;
        validationErrors.push({
          key,
          issues: errors.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
          })),
        });
      }
    }

    if (validationErrors.length) {
      throw new BadRequestException("Validation Error", {
        cause: validationErrors,
      });
    }

    return next() as unknown as NextFunction;
  };
};
