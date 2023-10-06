import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema, param, query } from "express-validator";
import { getContent, renameObjectKey, saveExcel } from "../utils/xlsx.util";
import path from "path";

const router = express.Router();
router.get(
  "/",
  validate([
    query("fields").optional().isString().notEmpty(),
    query("page").optional().isNumeric().notEmpty(),
    query("limit").optional().isNumeric().notEmpty(),
    query("orderBy").optional().isString().notEmpty(),
    query("orderType").optional().isString().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    // pagination (optional)
    const { page, limit, orderBy, orderType } = req.query;

    const { fields } = req.query;
    const fieldsArr = fields ? fields.toString().split(",") : undefined;
    prisma.masjid
      .findMany({
        ...(fields && {
          select: {
            id: fieldsArr?.includes("id"),
            nama_masjid: fieldsArr?.includes("nama_masjid"),
            nama_ketua_dkm: fieldsArr?.includes("nama_ketua_dkm"),
            no_hp: fieldsArr?.includes("no_hp"),
          },
        }),
        ...(page && {
          skip: (Number(page) - 1) * (Number(limit) || 10),
        }),
        ...(limit && {
          take: Number(limit),
        }),
        ...(orderBy && {
          orderBy: {
            [orderBy.toString()]: orderType?.toString() || "asc",
          },
        }),
      })
      .then((masjids) => {
        sendResponse({
          res,
          data: masjids,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/",
  validate([
    body("nama_masjid").notEmpty(),
    body("nama_ketua_dkm").notEmpty(),
    body("no_hp").notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
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
      })
      .catch((err) => {
        next(err);
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

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
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
    })
    .catch((err) => {
      next(err);
    });
});

router.get(
  "/:id",
  validate([param("id").isNumeric().toInt().isInt({ min: 1 })]),
  (req: Request, res: Response, next: NextFunction) => {
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
      })
      .catch((err) => {
        next(err);
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
  (req: Request, res: Response, next: NextFunction) => {
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
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
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
    })
    .catch((err) => {
      next(err);
    });
});

export default router;
