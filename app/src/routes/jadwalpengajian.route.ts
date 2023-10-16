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
import {
  formatDate,
  formatDateTime,
  templateReplacer,
  templateReplacerBulanan,
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
    query("template").isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id, template } = req.query;
    const idArr = (id as string).split(",").map((id) => BigInt(id));
    Promise.all([
      prisma.pengajian.findMany({
        where: {
          id: {
            in: idArr,
          },
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
        select: {
          content: true,
        },
      }),
    ]).then(([pengajians, template]) => {
      if (!pengajians.length || !template) {
        return sendResponse({
          res,
          error: "Jadwal pengajian atau template tidak ditemukan",
        });
      }
      const previews: string[] = [];
      for (const pengajian of pengajians) {
        const message = templateReplacer(template.content, [
          ["tanggal", formatDate(pengajian.tanggal)],
          ["waktu", pengajian.waktu.toString()],
          ["nama_masjid", pengajian.masjid.nama_masjid.toString()],
          ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh.toString()],
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
      prisma.pengajian.findMany({
        where: {
          id: {
            in: idArr,
          },
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
        select: {
          content: true,
        },
      }),
    ])
      .then(([pengajians, template]) => {
        if (!pengajians.length || !template) {
          return sendResponse({
            res,
            error: "Jadwal pengajian atau template tidak ditemukan",
          });
        }
        for (const pengajian of pengajians) {
          const message = templateReplacer(template.content, [
            ["tanggal", formatDate(pengajian.tanggal)],
            ["waktu", pengajian.waktu.toString()],
            ["nama_masjid", pengajian.masjid.nama_masjid.toString()],
            ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh.toString()],
          ]);
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
        }
        prisma.pengajian
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
          .then((pengajian) => {
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
  "/broadcast-bulanan-preview",
  validate([
    query("template").isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { template } = req.query;
    Promise.all([
      prisma.pengajian.findMany({
        select: {
          tanggal: true,
          waktu: true,
          masjid: {
            select: {
              id: true,
              no_hp: true,
              nama_ketua_dkm: true,
              nama_masjid: true,
            },
          },
          mubaligh: {
            select: {
              id: true,
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
    ]).then(([pengajians, template]) => {
      if (!pengajians.length || !template) {
        return sendResponse({
          res,
          error: "Jadwal pengajian atau template tidak ditemukan",
        });
      }
        let messagesByMasjid: Record<string, [string, string][][]> = {};
        let messagesByMubaligh: Record<string, [string, string][][]> = {};

        const previews: string[] = [];
        for (const pengajian of pengajians) {
          const replacements: [string, string][] = [
            ["tanggal", formatDate(pengajian.tanggal)],
            ["waktu", pengajian.waktu.toString()],
            ["nama_masjid", pengajian.masjid.nama_masjid.toString()],
            ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh.toString()],
          ];

          if (messagesByMasjid[pengajian.masjid.id.toString()]) {
            messagesByMasjid[pengajian.masjid.id.toString()].push(replacements);
          } else {
            messagesByMasjid[pengajian.masjid.id.toString()] = [replacements];
          }

          if (messagesByMubaligh[pengajian.mubaligh.id.toString()]) {
            messagesByMubaligh[pengajian.mubaligh.id.toString()].push(replacements);
          } else {
            messagesByMubaligh[pengajian.mubaligh.id.toString()] = [replacements];
          }
        }

        for (const id in messagesByMubaligh) {
          previews.push(templateReplacerBulanan(
            template.content,
            messagesByMubaligh[id]
          ));
        }

        for (const id in messagesByMasjid) {
          previews.push(templateReplacerBulanan(
            template.content,
            messagesByMasjid[id]
          ));
        }
      sendResponse({
        res,
        data: previews,
      });
    });
  }
);

router.get(
  "/broadcast-bulanan",
  validate([query("template").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
    const { template } = req.query;

    Promise.all([
      prisma.pengajian.findMany({
        select: {
          tanggal: true,
          waktu: true,
          masjid: {
            select: {
              id: true,
              no_hp: true,
              nama_ketua_dkm: true,
              nama_masjid: true,
            },
          },
          mubaligh: {
            select: {
              id: true,
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
      .then(([pengajians, template]) => {
        if (!pengajians.length || !template) {
          return sendResponse({
            res,
            error: "Jadwal pengajian atau template tidak ditemukan",
          });
        }

        interface Info {
          no_hp: string;
          messages: [string, string][][];
        }

        let messagesByMasjid: Record<string, Info> = {};
        let messagesByMubaligh: Record<string, Info> = {};

        for (const pengajian of pengajians) {
          const replacements: [string, string][] = [
            ["tanggal", formatDate(pengajian.tanggal)],
            ["waktu", pengajian.waktu.toString()],
            ["nama_masjid", pengajian.masjid.nama_masjid.toString()],
            ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh.toString()],
          ];

          const infoMasjid : Info = {
            no_hp: pengajian.masjid.no_hp,
            messages: [replacements],
          };

          const infoMubaligh : Info = {
            no_hp: pengajian.mubaligh.no_hp,
            messages: [replacements],
          };

          if (messagesByMasjid[pengajian.masjid.id.toString()]) {
            messagesByMasjid[pengajian.masjid.id.toString()].messages.push(replacements);
          } else {
            messagesByMasjid[pengajian.masjid.id.toString()] = {
              no_hp: pengajian.masjid.no_hp,
              messages: [replacements],
            };
          }

          if (messagesByMubaligh[pengajian.mubaligh.id.toString()]) {
            messagesByMubaligh[pengajian.mubaligh.id.toString()].messages.push(replacements);
          } else {
            messagesByMubaligh[pengajian.mubaligh.id.toString()] = {
              no_hp: pengajian.mubaligh.no_hp,
              messages: [replacements],
            };
          }
        }

        for (const id in messagesByMubaligh) {
          const message = templateReplacerBulanan(
            template.content,
            messagesByMubaligh[id].messages
          );
          addToQueue([
            {
              phone: messagesByMubaligh[id].no_hp,
              message: message,
            },
          ]);
        }

        for (const id in messagesByMasjid) {
          const message = templateReplacerBulanan(
            template.content,
            messagesByMasjid[id].messages
          );
          addToQueue([
            {
              phone: messagesByMasjid[id].no_hp,
              message: message,
            },
          ]);
        }
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
