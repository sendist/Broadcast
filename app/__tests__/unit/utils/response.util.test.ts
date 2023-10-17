import { Response } from "../../../src/types/express.type";
import sendResponse from "../../../src/utils/response.util";

// Mock Express Response Object
const mockResponse = {
  status: jest.fn(function () {
    return this;
  }),
  send: jest.fn(),
} as unknown as Response;

describe("sendResponse Function Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sendResponse should send a successful response with data", () => {
    const data = { message: "Data sent successfully" };
    sendResponse({ res: mockResponse, data });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ error: null, data });
  });

  test("sendResponse should send a response with an error message", () => {
    const error = "Internal Server Error";
    sendResponse({ res: mockResponse, error });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({ error, data: null });
  });

  test("sendResponse should allow specifying a custom status code", () => {
    const data = { message: "Custom Status Code Test" };
    const customStatus = 201;
    sendResponse({ res: mockResponse, data, status: customStatus });
    expect(mockResponse.status).toHaveBeenCalledWith(customStatus);
    expect(mockResponse.send).toHaveBeenCalledWith({ error: null, data });
  });

  test("sendResponse should default to status code 200 if no error is provided", () => {
    const data = { message: "Default Status Code Test" };
    sendResponse({ res: mockResponse, data });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ error: null, data });
  });

  test("sendResponse should default to status code 500 if an error is provided", () => {
    const error = "Default Error Status Code Test";
    sendResponse({ res: mockResponse, error });
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({ error, data: null });
  });
});
