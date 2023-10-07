import {
  NextFunction,
  Request,
  Response,
} from "../../../src/types/express.type";
import authentication from "../../../src/middlewares/authentication.middleware";
import { verifyAccessToken } from "../../../src/utils/jwt.util";
import sendResponse from "../../../src/utils/response.util";

jest.mock("../../../src/utils/response.util", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../../../src/utils/jwt.util", () => ({
  __esModule: true,
  verifyAccessToken: jest.fn(),
}));

describe("authentication middleware", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let verifyAccessTokenMock = verifyAccessToken as jest.Mock;
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

  test("should return an error if no access token is provided", () => {
    authentication(req, res, next);
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "No access token",
    });
  });

  test("should return an error if an invalid access token is provided", () => {
    req.headers = { authorization: "Bearer invalid_token" };
    verifyAccessTokenMock.mockReturnValueOnce({
      error: "InvalidAccessTokenError",
      data: null,
    });

    authentication(req, res, next);
    expect(verifyAccessTokenMock).toHaveBeenCalledWith("invalid_token");
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Invalid access token",
      status: 401,
    });
  });

  test("should return an error if an expired access token is provided", () => {
    req.headers = { authorization: `Bearer expired_token` };
    verifyAccessTokenMock.mockReturnValueOnce({
      error: "TokenExpiredError",
      data: null,
    });

    authentication(req, res, next);
    expect(verifyAccessTokenMock).toHaveBeenCalledWith("expired_token");
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Access token expired",
      status: 401,
    });
  });

  test("should set the user property on the request object if a valid access token is provided", () => {
    req.headers = { authorization: `Bearer success_token` };
    verifyAccessTokenMock.mockReturnValueOnce({
      error: null,
      data: { id: "user_id" },
    });
    authentication(req, res, next);
    expect(verifyAccessTokenMock).toHaveBeenCalledWith("success_token");
    expect(req.user).toEqual({ id: "user_id" });
    expect(next).toHaveBeenCalled();
  });
});
