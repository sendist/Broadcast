import express from "express";
import { Request, Response } from "../types/express.type";
import sendResponse from "../utils/response.util";
import prisma from "../utils/prisma.util";

const router = express.Router();

const getCustomizations = async (req: Request, res: Response) => {
  prisma.customization.findMany().then((customization) => {
    const customizations = customization.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return sendResponse({
      res,
      data: customizations,
    });
  });
};

router.get("/customizations", getCustomizations);

export default router;
