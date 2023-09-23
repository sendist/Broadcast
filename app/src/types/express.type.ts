import Express from "express";
import { User } from "./user.type";

export type Request = Express.Request & {
  user?: User;
};

export type Response = Express.Response;

export type NextFunction = Express.NextFunction;
