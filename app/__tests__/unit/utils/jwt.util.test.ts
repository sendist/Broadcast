import jwt from "jsonwebtoken";
import { Response } from "../../../src/types/express.type";
import {
  generateAccessToken,
  generateRefreshToken,
  generateWSToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyWSToken,
} from "../../../src/utils/jwt.util"; // Sesuaikan dengan jalur sebenarnya

// Mock Express Response Object
const mockResponse = {
  cookie: jest.fn(),
} as unknown as Response;

describe("JWT Utility Functions Unit Tests", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("generateAccessToken should generate a valid access token", () => {
    const user = { id: "1", username: "testuser" };
    if (process.env.ACCESS_TOKEN_SECRET) {
      const token = generateAccessToken(user);

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as {
          id: string;
          username: string;
        };
      } catch (err) {
        fail("Failed to verify the access token: " + (err as Error).message);
        return;
      }

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(user.id);
      expect(decoded.username).toBe(user.username);
    } else {
      fail(
        "ACCESS_TOKEN_SECRET is not set. Set it in your environment before running the test."
      );
    }
  });

  test("generateRefreshToken should generate a valid refresh token and set a cookie", () => {
    const user = { id: "1", username: "testuser" };
    if (process.env.REFRESH_TOKEN_SECRET) {
      const token = generateRefreshToken({
        res: mockResponse,
        id: user.id,
        username: user.username,
      });
      expect(token).toBeDefined();

      expect(mockResponse.cookie).toHaveBeenCalledWith("refreshToken", token, {
        httpOnly: true,
        path: "/api/auth/refresh",
        maxAge: 1000 * (60 * 60 * 24 * 14), // Expected refresh token expiration
      });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as {
          id: string;
          username: string;
        };
      } catch (err) {
        fail("Failed to verify the refresh token: " + (err as Error).message);
        return;
      }

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(user.id);
      expect(decoded.username).toBe(user.username);
    } else {
      fail(
        "REFRESH_TOKEN_SECRET is not set. Set it in your environment before running the test."
      );
    }
  });

  //   test("generateWSToken should generate a valid WebSocket token", () => {
  //     const user = { id: "1", username: "testuser" };
  //     if (process.env.WS_TOKEN_SECRET) {
  //       const token = generateWSToken(user);
  //       expect(token).toBeDefined();

  //       let decoded;
  //       try {
  //         decoded = jwt.verify(token, process.env.WS_TOKEN_SECRET) as {
  //           id: string;
  //           username: string;
  //         };
  //       } catch (err) {
  //         throw new Error(
  //           "Failed to verify the WebSocket token: " + (err as Error).message
  //         );
  //       }

  //       expect(decoded).toBeDefined();
  //       expect(decoded.id).toBe(user.id);
  //       expect(decoded.username).toBe(user.username);
  //     } else {
  //       throw new Error(
  //         "WS_TOKEN_SECRET is not set. Set it in your environment before running the test."
  //       );
  //     }
  //   });

  test("verifyAccessToken should verify a valid access token", () => {
    const user = { id: "1", username: "testuser" };
    if (process.env.ACCESS_TOKEN_SECRET) {
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2h",
      });

      const { error, data } = verifyAccessToken(token);
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(user.id);
      expect(data?.username).toBe(user.username);
    } else {
      fail(
        "ACCESS_TOKEN_SECRET is not set. Set it in your environment before running the test."
      );
    }
  });

  test("verifyRefreshToken should verify a valid refresh token", () => {
    const user = { id: "1", username: "testuser" };
    if (process.env.REFRESH_TOKEN_SECRET) {
      const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "14d",
      });

      const { error, data } = verifyRefreshToken(token);
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(user.id);
      expect(data?.username).toBe(user.username);
    } else {
      fail(
        "REFRESH_TOKEN_SECRET is not set. Set it in your environment before running the test."
      );
    }
  });

  //   test("verifyWSToken should verify a valid WebSocket token", () => {
  //     const user = { id: "1", username: "testuser" };
  //     if (process.env.WS_TOKEN_SECRET) {
  //       const token = jwt.sign(user, process.env.WS_TOKEN_SECRET, {
  //         expiresIn: "10s",
  //       });

  //       const { error, data } = verifyWSToken(token);
  //       expect(error).toBeNull();
  //       expect(data).toBeDefined();
  //       expect(data?.id).toBe(user.id);
  //       expect(data?.username).toBe(user.username);
  //     } else {
  //       fail(
  //         "WS_TOKEN_SECRET is not set. Set it in your environment before running the test."
  //       );
  //     }
  //   });
});
