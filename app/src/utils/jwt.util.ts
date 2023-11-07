import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "../types/express.type";
import { User } from "../types/user.type";
import { $Enums } from "@prisma/client";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "NO_SECRET";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "NO_SECRET";
const WS_TOKEN_SECRET = process.env.WS_TOKEN_SECRET || "NO_SECRET";

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 2;
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 14;
const WS_TOKEN_EXPIRES_IN = 10;

export type VerifyErrors =
  | { name: "JsonWebTokenError" }
  | { name: "NotBeforeError" }
  | { name: "TokenExpiredError" };

export function generateAccessToken({
  id,
  username,
  role
}: {
  id: string;
  username: string;
  role: $Enums.role_t;
}) {
  const token = jwt.sign({ id, username, role}, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  return token;
}

export function generateRefreshToken({
  res,
  id,
  username,
  role
}: {
  res: Response;
  id: string;
  username: string;
  role: $Enums.role_t
}) {
  const token = jwt.sign({ id, username, role }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  res.cookie("refreshToken", token, {
    httpOnly: true,
    path: "/api/auth/refresh",
    maxAge: 1000 * REFRESH_TOKEN_EXPIRES_IN,
  });
  return token;
}

export function generateWSToken(user: User) {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    WS_TOKEN_SECRET,
    {
      expiresIn: WS_TOKEN_EXPIRES_IN,
    }
  );
  return token;
}

export function verifyAccessToken(token: string) {
  try {
    return {
      error: null,
      data: jwt.verify(token, ACCESS_TOKEN_SECRET) as User,
    };
  } catch (err) {
    return { error: (err as VerifyErrors).name, data: null };
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return {
      error: null,
      data: jwt.verify(token, REFRESH_TOKEN_SECRET) as User,
    };
  } catch (err) {
    return { error: (err as VerifyErrors).name, data: null };
  }
}

export function verifyWSToken(token: string) {
  try {
    return {
      error: null,
      data: jwt.verify(token, WS_TOKEN_SECRET) as User,
    };
  } catch (err) {
    return { error: (err as VerifyErrors).name, data: null };
  }
}
