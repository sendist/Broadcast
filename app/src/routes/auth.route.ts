import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
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

export const authLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  return prisma.user
    .findUnique({
      where: {
        username,
      },
    })
    .then((user) => {
      if (user) {
        return bcrypt
          .compare(password, user.password.replace(/^\$2y/, "$2a"))
          .then((result) => {
            //if the user is authenticated
            if (result) {
              const token = generateAccessToken({
                id: user.id,
                username: user.username,
                role: user.role
              });
              generateRefreshToken({
                res,
                id: user.id,
                username: user.username,
                role: user.role
              });
              sendResponse({
                res,
                data: {
                  id: user.id,
                  username: user.username,
                  accessToken: token,
                  role: user.role
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
    })
    .catch((err) => {
      next(err);
    });
};
router.post(
  "/login",
  validate([body("username").notEmpty(), body("password").notEmpty()]),
  authLogin
);

export const authRefresh = (req: Request, res: Response) => {
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
        role: user.role
      });
      generateRefreshToken({
        res,
        id: user.id,
        username: user.username,
        role: user.role
      });
      return sendResponse({
        res,
        data: { 
          id: user.id,
          username: user.username,
          accessToken: token,
          role: user.role
        },
      });
    }
  } catch (err) {
    return sendResponse({
      res,
      error: "Invalid refresh token",
      status: 401,
    });
  }
};
router.get(
  "/refresh",
  validate([cookie("refreshToken").notEmpty()]),
  authRefresh
);

export const authLogout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  sendResponse({
    res,
    data: "Logged out successfully",
  });
};
router.get("/logout", authLogout);

export default router;
