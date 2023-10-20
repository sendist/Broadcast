import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, param, query } from "express-validator";
import { getFilledTemplate, getExcelContent } from "../utils/xlsx.util";
import { addToQueue } from "../utils/waweb.util";
import {
  jumatanMessages,
  transformPhoneMessageToSingle,
} from "../utils/broadcast";

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
    query("template").isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id, template } = req.query;
    const idArr = (id as string).split(",").map((id) => BigInt(id));

    return jumatanMessages({
      templateId: BigInt(template as string),
      jumatanId: idArr,
    })
      .then((messages) => {
        sendResponse({
          res,
          data: messages.map((message) => message.message),
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
    query("template").isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id, template } = req.query;
    const idArr = (id as string).split(",").map((id) => BigInt(id));

    return jumatanMessages({
      templateId: BigInt(template as string),
      jumatanId: idArr,
    })
      .then((messages) => {
        addToQueue(transformPhoneMessageToSingle(messages));
      })
      .then(() => {
        prisma.jumatan
          .updateMany({
            where: {
              id: {
                in: idArr,
              },
            },
            data: {
              broadcasted: true,
            },
          })
          .then(() => {
            sendResponse({
              res,
              data: "Success",
            });
          })
          .catch((err) => {
            next(err);
          });
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
