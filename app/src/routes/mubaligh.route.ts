import express from "express";
import { Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  prisma.mubaligh.findMany().then((mubalighs) => {
    sendResponse({
      res,
      data: mubalighs,
    });
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.mubaligh
    .findUnique({
      where: {
        id: parseInt(id),
      },
    })
    .then((mubaligh) => {
      sendResponse({
        res,
        data: mubaligh,
      });
    });
});

export default router;