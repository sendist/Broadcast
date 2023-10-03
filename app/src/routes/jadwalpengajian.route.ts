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
  prisma.pengajian.findMany().then((jadwalpengajians) => {
    sendResponse({
      res,
      data: jadwalpengajians,
    });
  });
});

router.post(
  "/",
  validate([
    body("tanggal").notEmpty(),
    body("waktu").notEmpty(),
    body("id_masjid").notEmpty(),
    body("id_mubaligh").notEmpty(),
  ]),
  (req: Request, res: Response) => {
    const { tanggal, waktu, id_masjid, id_mubaligh } = req.body;
    const parsedTanggal = new Date(tanggal);
    prisma.pengajian
      .create({
        data: {
          tanggal,
          waktu,
          id_masjid,
          id_mubaligh,
        },
      })
      .then((pengajian) => {
        sendResponse({
          res,
          data: pengajian,
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
  const filePath = path.join("excelTemplates", "template_jadwalpengajian.xlsx");
  res.download(filePath, "template_jadwalpengajian.xlsx");
});

router.post("/upload", (req: Request, res: Response) => {
  const newObj = renameObjectKey(getContent(req.body), [
    ["Tanggal Pengajian", "tanggal"],
    ["Waktu Pengajian", "waktu"],
    ["Kode Masjid", "id_masjid"],
    ["Kode Mubaligh", "id_mubaligh"],
  ]);
  // TODO: JO BUAT CONVERT TIPE DATA

  console.log(newObj);
  prisma.pengajian
    .createMany({
      data: newObj,
    })
    .then((pengajian) => {
      sendResponse({
        res,
        data: pengajian,
      });
    });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.pengajian
    .findUnique({
      where: {
        id: BigInt(id),
      },
    })
    .then((pengajian) => {
      sendResponse({
        res,
        data: pengajian,
      });
    });
});

router.patch(
  "/:id",
  validate([
    body("tanggal").optional().isDate(),
    body("waktu").optional().isString(),
    body("id_masjid").optional().isInt(),
    body("id_mubaligh").optional().isInt(),
  ]),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const { tanggal, waktu, id_masjid, id_mubaligh } = req.body;
    prisma.pengajian
      .update({
        where: {
          id: BigInt(id),
        },
        data: {
          tanggal,
          waktu,
          id_masjid,
          id_mubaligh,
        },
      })
      .then((pengajian) => {
        sendResponse({
          res,
          data: pengajian,
        });
      });
  }
);

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.pengajian
    .delete({
      where: {
        id: BigInt(id),
      },
    })
    .then((pengajian) => {
      sendResponse({
        res,
        data: pengajian,
      });
    });
});

export default router;
