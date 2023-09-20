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
              if (result) {
                const accessToken = generateAccessToken({
                  id: user.id,
                  username: user.username,
                });
                generateRefreshToken({
                  res,
                  id: user.id,
                  username: user.username,
                });
                res.json({ accessToken });
              } else {
                res.status(401).send({
                  error: "Invalid username or password",
                });
              }
            });
        } else {
          res.status(401).send({
            error: "Invalid username or password",
          });
        }
      });
  }
);

router.get(
  "/refresh",
  validate([cookie("refreshToken").notEmpty().isJWT()]),
  (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    try {
      const user = verifyRefreshToken(refreshToken);
      const accessToken = generateAccessToken({
        id: user.id,
        username: user.username,
      });
      generateRefreshToken({
        res,
        id: user.id,
        username: user.username,
      });
      res.json({ accessToken });
    } catch (err) {
      return res.status(403).send({
        error: "Invalid refresh token",
      });
    }
  }
);

export default router;
