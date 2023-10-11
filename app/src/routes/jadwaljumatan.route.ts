import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema, param, query } from "express-validator";
import {
  getFilledTemplate,
  getExcelContent,
  renameObjectKey,
} from "../utils/xlsx.util";
import path from "path";
import { addToQueue } from "../utils/waweb.util";
import {
  formatDate,
  formatDateTime,
  templateReplacer,
} from "../utils/etc.util";

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
    query("id").isNumeric().notEmpty(),
    query("template").isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id, template } = req.query;
    const idArr = (id as string).split(",").map((id) => BigInt(id));

    Promise.all([
      prisma.jumatan.findMany({
        where: {
          id: {
            in: idArr,
          },
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
        select: {
          content: true,
        },
      }),
    ]).then(([jumatans, template]) => {
      if (!jumatans.length || !template) {
        return sendResponse({
          res,
          error: "Jadwal jumatan atau template tidak ditemukan",
        });
      }
      const previews: string[] = [];
      for (const jumatan of jumatans) {
        const message = templateReplacer(template.content, [
          ["tanggal", formatDate(jumatan.tanggal)],
          ["nama_masjid", jumatan.masjid.nama_masjid],
          ["nama_mubaligh", jumatan.mubaligh.nama_mubaligh],
        ]);
        previews.push(message);
      }
      sendResponse({
        res,
        data: previews,
      });
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

    Promise.all([
      prisma.jumatan.findMany({
        where: {
          id: {
            in: idArr,
          },
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
        select: {
          content: true,
        },
      }),
    ])
      .then(([jumatans, template]) => {
        if (!jumatans.length || !template) {
          return sendResponse({
            res,
            error: "Jadwal jumatan atau template tidak ditemukan",
          });
        }
        for (const jumatan of jumatans) {
          const message = templateReplacer(template.content, [
            ["tanggal", formatDate(jumatan.tanggal)],
            ["nama_masjid", jumatan.masjid.nama_masjid],
            ["nama_mubaligh", jumatan.mubaligh.nama_mubaligh],
          ]);
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
        }
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
