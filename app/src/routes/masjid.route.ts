import express from "express";
import { Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema } from "express-validator";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  prisma.masjid.findMany().then((masjids) => {
    sendResponse({
      res,
      data: masjids,
    });
  });
});

router.post(
  "/",
  validate([
    body("nama_masjid").notEmpty(),
    body("nama_ketua_dkm").notEmpty(),
    body("no_hp").notEmpty(),
  ]),
  (req: Request, res: Response) => {
    const { nama_masjid, nama_ketua_dkm, no_hp } = req.body;
    prisma.masjid
      .create({
        data: {
          nama_masjid,
          nama_ketua_dkm,
          no_hp,
        },
      })
      .then((masjid) => {
        sendResponse({
          res,
          data: masjid,
        });
      });
  }
);

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.masjid
    .findUnique({
      where: {
        id: BigInt(id),
      },
    })
    .then((masjid) => {
      sendResponse({
        res,
        data: masjid,
      });
    });
});

router.patch(
  "/:id",
  validate([
    body("nama_masjid").optional().isString(),
    body("nama_ketua_dkm").optional().isString(),
    body("no_hp").optional().isString(),
  ]),
  (req: Request, res: Response) => {
    console.log("a");
    const { id } = req.params;
    const { nama_masjid, nama_ketua_dkm, no_hp } = req.body;
    prisma.masjid
      .update({
        where: {
          id: BigInt(id),
        },
        data: {
          nama_masjid,
          nama_ketua_dkm,
          no_hp,
        },
      })
      .then((masjid) => {
        sendResponse({
          res,
          data: masjid,
        });
      });
  }
);

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.masjid
    .delete({
      where: {
        id: BigInt(id),
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
