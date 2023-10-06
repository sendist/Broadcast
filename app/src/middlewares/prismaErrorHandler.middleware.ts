import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "../types/express.type";
import sendResponse from "../utils/response.util";

const prismaErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the error is a Prisma error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known errors
    switch (err.code) {
      case "P2002":
        return sendResponse({
          res,
          error: `Duplicate field value: ${err.meta?.target}`,
          status: 400,
        });
      case "P2014":
        return sendResponse({
          res,
          error: `Invalid ID: ${err.meta?.target}`,
          status: 400,
        });
      case "P2003":
        return sendResponse({
          res,
          error: `Invalid input data: ${err.meta?.target}`,
          status: 400,
        });
      default:
        return sendResponse({
          res,
          error: `Something went wrong: ${err.message}`,
          status: 500,
        });
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    // Handle unknown errors
    return res.status(500).json({
      message: `Something went wrong: ${err.message}`,
    });
  } else {
    next(err);
  }
};

export default prismaErrorHandler;
