import {
  validationResult,
  ValidationChain,
  checkExact,
} from "express-validator";
import { NextFunction, Request, Response } from "../types/express.type";
import sendResponse from "../utils/response.util";

export default function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await checkExact(validations).run(req);

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    sendResponse({ res, error: "Bad Request", status: 400 });
  };
}
