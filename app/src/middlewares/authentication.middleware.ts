import { NextFunction, Request, Response } from "../types/express.type";
import { verifyAccessToken } from "../utils/jwt.util";
import sendResponse from "../utils/response.util";

export default function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return sendResponse({ res, error: "No access token" });
  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    return sendResponse({ res, error: "Invalid access token" });
  }
}