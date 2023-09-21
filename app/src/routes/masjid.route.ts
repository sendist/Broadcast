import express from "express";
import { Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  prisma.masjid.findMany().then((masjids) => {
    sendResponse({
      res,
      data: masjids,
    });
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.masjid
    .findUnique({
      where: {
        id: parseInt(id),
      },
    })
    .then((masjid) => {
      sendResponse({
        res,
        data: masjid,
      });
    });
});

export default router;
