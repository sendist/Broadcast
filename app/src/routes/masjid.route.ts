import express from "express";
import { Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema, param } from "express-validator";
import { getContent, renameObjectKey, saveExcel } from "../utils/xlsx";
import path from "path";

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
// TODO: still temporary
router.get("/template", (req: Request, res: Response) => {
  res.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  const filePath = path.join("excelTemplates", "template_masjid.xlsx");
  res.download(filePath, "template_masjid.xlsx");
});

router.post("/upload", (req: Request, res: Response) => {
  const newObj = renameObjectKey(getContent(req.body), [
    ["Nama Masjid", "nama_masjid"],
    ["Nama Ketua DKM", "nama_ketua_dkm"],
    ["No. HP", "no_hp"],
  ]);
  console.log(newObj);
  prisma.masjid
    .createMany({
      data: newObj,
    })
    .then((masjid) => {
      sendResponse({
        res,
        data: masjid,
      });
    });
});

router.get(
  "/:id",
  validate([param("id").isNumeric().toInt().isInt({ min: 1 })]),
  (req: Request, res: Response) => {
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
  }
);

router.patch(
  "/:id",
  validate([
    body("nama_masjid").optional().isString(),
    body("nama_ketua_dkm").optional().isString(),
    body("no_hp").optional().isString(),
  ]),
  (req: Request, res: Response) => {
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
