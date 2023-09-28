import express from "express";
import { Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util";
import validate from "../middlewares/validation.middleware";
import { body, cookie } from "express-validator";
import sendResponse from "../utils/response.util";

const router = express.Router();
router.post(
  "/login",
  validate([body("username").notEmpty(), body("password").notEmpty()]),
  (req: Request, res: Response) => {
    const { username, password } = req.body;
    prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .then((user) => {
        if (user) {
          bcrypt
            .compare(password, user.password.replace(/^\$2y/, "$2a"))
            .then((result) => {
              //if the user is authenticated
              if (result) {
                const token = generateAccessToken({
                  id: user.id,
                  username: user.username,
                });
                generateRefreshToken({
                  res,
                  id: user.id,
                  username: user.username,
                });
                sendResponse({
                  res,
                  data: {
                    id: user.id,
                    username: user.username,
                    accessToken: token,
                  },
                });
              } else {
                sendResponse({
                  res,
                  error: "Invalid username or password",
                  status: 401,
                });
              }
            });
        } else {
          sendResponse({
            res,
            error: "Invalid username or password",
            status: 401,
          });
        }
      });
  }
);

router.get("/refresh", (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const { error, data: user } = verifyRefreshToken(refreshToken);
    if (error) {
      return sendResponse({
        res,
        error: "Invalid refresh token",
        status: 401,
      });
    }
    if (user) {
      const token = generateAccessToken({
        id: user.id,
        username: user.username,
      });
      generateRefreshToken({
        res,
        id: user.id,
        username: user.username,
      });
      return sendResponse({
        res,
        data: { id: user.id, username: user.username, accessToken: token },
      });
    }
  } catch (err) {
    return sendResponse({
      res,
      error: "Invalid refresh token",
      status: 401,
    });
  }
});

router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  sendResponse({
    res,
    data: "Logged out successfully",
  });
});

export default router;
