import errorHandler from "../../../src/middlewares/errorHandler.middleware";
import {
  NextFunction,
  Request,
  Response,
} from "../../../src/types/express.type";
import sendResponse from "../../../src/utils/response.util";

jest.mock("../../../src/utils/response.util", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("errorHandler middleware", () => {
  let sendResponseMock = sendResponse as jest.Mock;
  beforeEach(() => {});

  test("should return a 500 status code and an error message", () => {
    const err = new Error("Test error");
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorHandler(err, req, res, next);
    // expect console.error
    expect(sendResponseMock).toHaveBeenCalledWith({
      res,
      error: "Test error",
      status: 500,
    });
  });
});
