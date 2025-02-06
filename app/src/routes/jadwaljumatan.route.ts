import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, param, query } from "express-validator";
import { getFilledTemplate, getExcelContent } from "../utils/xlsx.util";
import { addToQueue } from "../utils/waweb.util";
import {
  jumatanBulananMessages,
  jumatanMessages,
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
    query("dateStart").optional().isISO8601(),
    query("dateEnd").optional().isISO8601(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, orderBy, orderType, dateStart, dateEnd } = req.query;

    const { fields } = req.query;
    const fieldsArr = fields ? fields.toString().split(",") : undefined;
    prisma.jumatan
      .findMany({
        where: {
          ...((dateStart || dateEnd) && {
            tanggal: {
              ...(dateStart && {
                gte: new Date(dateStart as string),
              }),
              ...(dateEnd && {
                lte: new Date(dateEnd as string),
              }),
            },
          }),
        },
        ...(fields && {
          select: {
            id: fieldsArr?.includes("id"),
            tanggal: fieldsArr?.includes("tanggal"),
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
      getFilledTemplate("jumatan", masjids, mubalighs)
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
  getExcelContent(req.body, "jumatan")
    .then((data) =>
      prisma.jumatan
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

    return jumatanMessages({
      templateIdDKM:
        templateDKM !== undefined ? BigInt(templateDKM as string) : undefined,
      templateIdMubaligh:
        templateMubaligh !== undefined
          ? BigInt(templateMubaligh as string)
          : undefined,
      jumatanId: idArr,
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

    return jumatanMessages({
      templateIdDKM:
        templateDKM !== undefined ? BigInt(templateDKM as string) : undefined,
      templateIdMubaligh:
        templateMubaligh !== undefined
          ? BigInt(templateMubaligh as string)
          : undefined,
      jumatanId: idArr,
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
    jumatanBulananMessages({
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
    jumatanBulananMessages({
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
    prisma.jumatan
      .deleteMany({
        where: {
          id: {
            in: idArr,
          },
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

router.get(
  "/:id",
  validate([param("id").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
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
  }
);

router.patch(
  "/:id",
  validate([
    param("id").isNumeric().notEmpty(),
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

router.delete(
  "/:id",
  validate([param("id").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export default router;
