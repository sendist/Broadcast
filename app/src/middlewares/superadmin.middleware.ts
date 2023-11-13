import { NextFunction, Request, Response } from "../types/express.type";
import sendResponse from "../utils/response.util";

export default function superadmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "superadmin") {
    return sendResponse({
      res,
      error: "Not a superadmin!",
      status: 401,
    });
  }
  next();
}
