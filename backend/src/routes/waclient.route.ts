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
import waClient from "../utils/waweb.util";

const router = express.Router();
router.get("/qr", (req: Request, res: Response) => {
    waClient
    }
);

export default router;