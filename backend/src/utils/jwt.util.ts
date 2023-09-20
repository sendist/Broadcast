import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "../types/express.type";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "NO_SECRET";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "NO_SECRET";

export function generateAccessToken({
  id,
  username,
}: {
  id: string;
  username: string;
}) {
  return jwt.sign({ id, username }, ACCESS_TOKEN_SECRET, {
    expiresIn: "12h",
  });
}

export function generateRefreshToken({
  res,
  id,
  username,
}: {
  res: Response;
  id: string;
  username: string;
}) {
  const token = jwt.sign({ id, username }, REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("refreshToken", token, {
    httpOnly: true,
    path: "/api/auth/refresh",
    maxAge: 1000 * 60 * 60 * 24,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as {
    id: string;
    username: string;
  };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as {
    id: string;
    username: string;
  };
}
