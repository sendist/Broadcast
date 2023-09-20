import Express from "express";

export type Request = Express.Request & {
  user?: {
    id: string;
    username: string;
  };
};

export type Response = Express.Response;

export type NextFunction = Express.NextFunction;
