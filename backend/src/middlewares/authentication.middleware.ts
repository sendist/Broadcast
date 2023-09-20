import { NextFunction, Request, Response } from "../types/express.type";
import { verifyAccessToken } from "../utils/jwt.util";

export default function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).send({
      error: "Invalid access token",
    });
  }
}
