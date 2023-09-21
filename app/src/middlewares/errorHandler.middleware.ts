import { NextFunction, Request, Response } from "../types/express.type";
import sendResponse from "../utils/response.util";
export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  sendResponse({ res, error: err.message, status: 500 });
}
