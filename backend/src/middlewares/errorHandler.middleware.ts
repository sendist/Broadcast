import { NextFunction, Request, Response } from "../types/express.type";
export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  res.status(500).send({
    error: "Internal Server Error",
  });
}
