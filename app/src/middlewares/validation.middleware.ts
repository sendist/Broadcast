import { validationResult, ValidationChain } from "express-validator";
import { NextFunction, Request, Response } from "../types/express.type";
import sendResponse from "../utils/response.util";

export default function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.array().length > 0) {
        break;
      }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    sendResponse({ res, error: "Bad Request", status: 400 });
  };
}
