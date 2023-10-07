import {
  NextFunction,
  Request,
  Response,
} from "../../../src/types/express.type";
import prismaErrorHandler from "../../../src/middlewares/prismaErrorHandler.middleware";
import sendResponse from "../../../src/utils/response.util";
import { Prisma } from "@prisma/client";

jest.mock("../../../src/utils/response.util", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("prismaErrorHandler middleware", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let sendResponseMock = sendResponse as jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  test("should go to the next middleware if error is not a Prisma error", () => {
    const err = new Error("Test error");
    prismaErrorHandler(err, req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test("should return 400 status code and error message when PrismaClientKnownRequestError P2002 is thrown", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Test error", {
      meta: {
        target: "test",
      },
      code: "P2002",
      clientVersion: "testing",
    });
    prismaErrorHandler(err, req, res, next);
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Duplicate field value: test",
      status: 400,
    });
  });

  test("should return 400 status code and error message when PrismaClientKnownRequestError P2014 is thrown", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Test error", {
      meta: {
        target: "test",
      },
      code: "P2014",
      clientVersion: "testing",
    });
    prismaErrorHandler(err, req, res, next);
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Invalid ID: test",
      status: 400,
    });
  });

  test("should return 400 status code and error message when PrismaClientKnownRequestError P2003 is thrown", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Test error", {
      meta: {
        target: "test",
      },
      code: "P2003",
      clientVersion: "testing",
    });
    prismaErrorHandler(err, req, res, next);
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Invalid input data: test",
      status: 400,
    });
  });

  test("should return 500 status code and error message when PrismaClientKnownRequestError other code is thrown", () => {
    const err = new Prisma.PrismaClientKnownRequestError("Test error", {
      meta: {
        target: "test",
      },
      code: "P1000",
      clientVersion: "testing",
    });
    prismaErrorHandler(err, req, res, next);
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Something went wrong: Test error",
      status: 500,
    });
  });

  test("should return 500 status code and error message when PrismaClientUnknownRequestError is thrown", () => {
    const err = new Prisma.PrismaClientUnknownRequestError("Test error", {
      clientVersion: "testing",
    });
    prismaErrorHandler(err, req, res, next);
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Something went wrong: Test error",
      status: 500,
    });
  });
});
