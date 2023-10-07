import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema, param, query } from "express-validator";
import { getContent, renameObjectKey, saveExcel } from "../utils/xlsx.util";
import path from "path";
import { addToQueue } from "../utils/waweb.util";
import { formatDateTime } from "../utils/etc.util";

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
    const { page, limit, orderBy, orderType } = req.query;

    const { fields } = req.query;
    const fieldsArr = fields ? fields.toString().split(",") : undefined;
    prisma.jumatan
      .findMany({
        ...(fields && {
          select: {
            id: fieldsArr?.includes("id"),
            tanggal: fieldsArr?.includes("tanggal"),
            id_masjid: fieldsArr?.includes("id_masjid"),
            id_mubaligh: fieldsArr?.includes("id_mubaligh"),
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
      .then((jadwaljumatans) => {
        sendResponse({
          res,
          data: jadwaljumatans,
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
    body("tanggal").notEmpty(),
    body("id_masjid").notEmpty(),
    body("id_mubaligh").notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { tanggal, id_masjid, id_mubaligh } = req.body;
    const parsedTanggal = new Date(tanggal);
    prisma.jumatan
      .create({
        data: {
          tanggal,
          id_masjid,
          id_mubaligh,
        },
      })
      .then((jumatan) => {
        sendResponse({
          res,
          data: jumatan,
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
  const filePath = path.join("excelTemplates", "template_jadwaljumatan.xlsx");
  res.download(filePath, "template_jadwaljumatan.xlsx");
});

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  const newObj = renameObjectKey(getContent(req.body), [
    ["Tanggal Jumatan", "tanggal"],
    ["Kode Masjid", "id_masjid"],
    ["Kode Mubaligh", "id_mubaligh"],
  ]);
  // TODO: JO BUAT CONVERT TIPE DATA

  console.log(newObj);
  prisma.jumatan
    .createMany({
      data: newObj,
    })
    .then((jumatan) => {
      sendResponse({
        res,
        data: jumatan,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get(
  "/broadcast",
  validate([
    query("id").isNumeric().notEmpty(),
    query("template").isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id, template } = req.query;
    console.log(req.params);
    Promise.all([
      prisma.jumatan.findUnique({
        where: {
          id: BigInt(id as string),
        },
        select: {
          tanggal: true,
          masjid: {
            select: {
              no_hp: true,
              nama_ketua_dkm: true,
              nama_masjid: true,
            },
          },
          mubaligh: {
            select: {
              no_hp: true,
              nama_mubaligh: true,
            },
          },
        },
      }),
      prisma.template.findUnique({
        where: {
          id: BigInt(template as string),
        },
      }),
    ])
      .then(([jumatan, template]) => {
        if (!jumatan || !template) {
          return sendResponse({
            res,
            error: "Jadwal jumatan atau template tidak ditemukan",
          });
        }
        const message = template.content
          .replace("{{tanggal}}", formatDateTime(jumatan.tanggal))
          .replace("{{nama_masjid}}", jumatan.masjid.nama_masjid.toString())
          .replace(
            "{{nama_mubaligh}}",
            jumatan.mubaligh.nama_mubaligh.toString()
          );
        addToQueue([
          {
            phone: jumatan.masjid.no_hp,
            message: message,
          },
          {
            phone: jumatan.mubaligh.no_hp,
            message: message,
          },
        ]);
        sendResponse({
          res,
          data: "Success",
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  prisma.jumatan
    .findUnique({
      where: {
        id: BigInt(id),
      },
    })
    .then((jumatan) => {
      sendResponse({
        res,
        data: jumatan,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.patch(
  "/:id",
  validate([
    body("tanggal").optional().isISO8601(),
    body("id_masjid").optional().isInt(),
    body("id_mubaligh").optional().isInt(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { tanggal, id_masjid, id_mubaligh } = req.body;
    prisma.jumatan
      .update({
        where: {
          id: BigInt(id),
        },
        data: {
          tanggal,
          id_masjid,
          id_mubaligh,
        },
      })
      .then((jumatan) => {
        sendResponse({
          res,
          data: jumatan,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  prisma.jumatan
    .delete({
      where: {
        id: BigInt(id),
      },
    })
    .then((jumatan) => {
      sendResponse({
        res,
        data: jumatan,
      });
    })
    .catch((err) => {
      next(err);
    });
});

export default router;
