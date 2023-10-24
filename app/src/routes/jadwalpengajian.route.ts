import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, param, query } from "express-validator";
import { getExcelContent, getFilledTemplate } from "../utils/xlsx.util";
import { addToQueue } from "../utils/waweb.util";
import {
  pengajianBulananMessages,
  pengajianMessages,
  transformPhoneMessageToSingle,
} from "../utils/broadcast.util";

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
            broadcasted: fieldsArr?.includes("broadcasted"),
          },
        }),
        ...(page && {
          skip: (Number(page) - 1) * (Number(limit) || 10),
        }),
        ...(limit && {
          take: Number(limit),
        }),
        orderBy: {
          id: "desc",
        },
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
    return prisma.pengajian
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
          "attachment; filename=template_jadwalpengajian.xlsx",
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
  "/broadcast-preview",
  validate([
    query("id")
      .matches(/^[0-9]+(,[0-9]+)*$/)
      .notEmpty(),
    query("templateDKM").optional().isNumeric().notEmpty(),
    query("templateMubaligh").optional().isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id, templateDKM, templateMubaligh } = req.query;
    const idArr = (id as string).split(",").map((id) => BigInt(id));
    pengajianMessages({
      templateIdDKM:
        templateDKM !== undefined ? BigInt(templateDKM as string) : undefined,
      templateIdMubaligh:
        templateMubaligh !== undefined
          ? BigInt(templateMubaligh as string)
          : undefined,
      pengajianId: idArr,
    })
      .then((messages) => {
        sendResponse({
          res,
          data: messages.map((message) => ({
            message: message.message,
            recipients: message.recipients,
          })),
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get(
  "/broadcast",
  validate([
    query("id")
      .matches(/^[0-9]+(,[0-9]+)*$/)
      .notEmpty(),
    query("templateDKM").optional().isNumeric().notEmpty(),
    query("templateMubaligh").optional().isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id, templateDKM, templateMubaligh } = req.query;
    const idArr = (id as string).split(",").map((id) => BigInt(id));

    return pengajianMessages({
      templateIdDKM: BigInt(templateDKM as string),
      templateIdMubaligh: BigInt(templateMubaligh as string),
      pengajianId: idArr,
      changeStatusToBroadcasted: true,
    })
      .then((messages) => {
        addToQueue(transformPhoneMessageToSingle(messages));
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get(
  "/broadcast-bulanan-preview",
  validate([
    query("month")
      .matches(/^(1[0-1]|0?[0-9])$/)
      .notEmpty(),
    query("templateDKM").optional().isNumeric().notEmpty(),
    query("templateMubaligh").optional().isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { month, templateDKM, templateMubaligh } = req.query;
    const year =
      Number(month) >= new Date().getMonth()
        ? new Date().getFullYear()
        : new Date().getFullYear() + 1;
    pengajianBulananMessages({
      templateIdDKM:
        templateDKM !== undefined ? BigInt(templateDKM as string) : undefined,
      templateIdMubaligh:
        templateMubaligh !== undefined
          ? BigInt(templateMubaligh as string)
          : undefined,
      month: Number(month),
      year: year,
    })
      .then((messages) => {
        sendResponse({
          res,
          data: messages.map((message) => ({
            message: message.message,
            recipients: message.recipients,
          })),
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get(
  "/broadcast-bulanan",
  validate([
    query("month")
      .matches(/^(1[0-1]|0?[0-9])$/)
      .notEmpty(),
    query("templateDKM").optional().isNumeric().notEmpty(),
    query("templateMubaligh").optional().isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { month, templateDKM, templateMubaligh } = req.query;
    const year =
      Number(month) >= new Date().getMonth()
        ? new Date().getFullYear()
        : new Date().getFullYear() + 1;
    pengajianBulananMessages({
      templateIdDKM:
        templateDKM !== undefined ? BigInt(templateDKM as string) : undefined,
      templateIdMubaligh:
        templateMubaligh !== undefined
          ? BigInt(templateMubaligh as string)
          : undefined,
      month: Number(month),
      year: year,
    })
      .then((messages) => {
        addToQueue(transformPhoneMessageToSingle(messages));
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete(
  "/batch",
  validate([
    query("id")
      .matches(/^[0-9]+(,[0-9]+)*$/)
      .notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    const idArr = (id as string).split(",").map((id) => BigInt(id));
    prisma.pengajian
      .deleteMany({
        where: {
          id: {
            in: idArr,
          },
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
