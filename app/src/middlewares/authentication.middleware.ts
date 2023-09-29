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
  const { error, data: user } = verifyAccessToken(token);
  if (error) {
    if (error === "TokenExpiredError") {
      return sendResponse({ res, error: "Access token expired", status: 401 });
    }
    return sendResponse({ res, error: "Invalid access token", status: 401 });
  }
  req.user = user;
  next();
}
