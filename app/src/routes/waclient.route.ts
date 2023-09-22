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
import { client, data } from "../utils/waweb.util";
import sendResponse from "../utils/response.util";
import WAWebJS from "whatsapp-web.js";

const router = express.Router();
router.get("/qr", (req: Request, res: Response) => {
  client.getState().then((state) => {
    sendResponse({
      res,
      data: { status: state },
    });
  });
});

export default router;
