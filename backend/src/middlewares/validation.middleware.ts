import { validationResult, ValidationChain } from "express-validator";
import { NextFunction, Request, Response } from "../types/express.type";

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

    res.status(400).json({ error: "Bad Request" });
  };
}
