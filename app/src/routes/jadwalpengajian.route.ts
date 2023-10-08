import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema, param, query } from "express-validator";
import {
  getExcelContent,
  getFilledTemplate,
  renameObjectKey,
} from "../utils/xlsx.util";
import path from "path";
import { addToQueue } from "../utils/waweb.util";
import { formatDate, formatDateTime } from "../utils/etc.util";

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
    prisma.pengajian
      .findMany({
        ...(fields && {
          select: {
            id: fieldsArr?.includes("id"),
            tanggal: fieldsArr?.includes("tanggal"),
            waktu: fieldsArr?.includes("waktu"),
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
      .then((jadwalpengajians) => {
        sendResponse({
          res,
          data: jadwalpengajians,
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
    body("waktu").notEmpty(),
    body("id_masjid").notEmpty(),
    body("id_mubaligh").notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { tanggal, waktu, id_masjid, id_mubaligh } = req.body;
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
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get("/template", (req: Request, res: Response) => {
  res.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  Promise.all([
    prisma.masjid.findMany({
      select: {
        id: true,
        nama_masjid: true,
      },
      orderBy: {
        id: "asc",
      },
    }),
    prisma.mubaligh.findMany({
      select: {
        id: true,
        nama_mubaligh: true,
      },
      orderBy: {
        id: "asc",
      },
    }),
  ])
    .then(([masjids, mubalighs]) =>
      getFilledTemplate("pengajian", masjids, mubalighs)
    )
    .then((buffer) => {
      res.writeHead(200, {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          "attachment; filename=template_jadwaljumatan.xlsx",
      });
      res.end(buffer);
    });
});

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  getExcelContent(req.body, "pengajian")
    .then((data) =>
      prisma.pengajian
        .createMany({
          data,
        })
        .then((jumatan) => {
          sendResponse({
            res,
            data: "OK",
          });
        })
    )
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
      prisma.pengajian.findUnique({
        where: {
          id: BigInt(id as string),
        },
        select: {
          tanggal: true,
          waktu: true,
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
      .then(([pengajian, template]) => {
        if (!pengajian || !template) {
          return sendResponse({
            res,
            error: "Jadwal pengajian atau template tidak ditemukan",
          });
        }
        const message = template.content
          .replace("{{tanggal}}", formatDate(pengajian.tanggal))
          .replace("{{waktu}}", pengajian.waktu.toString())
          .replace("{{nama_masjid}}", pengajian.masjid.nama_masjid.toString())
          .replace(
            "{{nama_mubaligh}}",
            pengajian.mubaligh.nama_mubaligh.toString()
          );
        addToQueue([
          {
            phone: pengajian.masjid.no_hp,
            message: message,
          },
          {
            phone: pengajian.mubaligh.no_hp,
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

router.get(
  "/:id",
  validate([param("id").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
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
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.patch(
  "/:id",
  validate([
    param("id").isNumeric().notEmpty(),
    body("tanggal").optional().isISO8601(),
    body("waktu").optional().isString(),
    body("id_masjid").optional().isInt(),
    body("id_mubaligh").optional().isInt(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
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
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete(
  "/:id",
  validate([param("id").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
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
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
