import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema, param, query } from "express-validator";
import { getExcelContent, renameObjectKey } from "../utils/xlsx.util";
import path from "path";

const router = express.Router();

const getMasjid = (req: Request, res: Response, next: NextFunction) => {
  // pagination (optional)
  const { page, limit, orderBy, orderType, search } = req.query;

  const { fields } = req.query;
  const fieldsArr = fields ? fields.toString().split(",") : undefined;
  return prisma.masjid
    .findMany({
      ...(fields && {
        select: {
          id: fieldsArr?.includes("id"),
          nama_masjid: fieldsArr?.includes("nama_masjid"),
          nama_ketua_dkm: fieldsArr?.includes("nama_ketua_dkm"),
          no_hp: fieldsArr?.includes("no_hp"),
        },
      }),
      ...(search && {
        where: {
          OR: [
            {
              nama_masjid: {
                contains: search.toString(),
                mode: "insensitive",
              },
            },
            {
              nama_ketua_dkm: {
                contains: search.toString(),
                mode: "insensitive",
              },
            },
          ],
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
    .then((masjids) => {
      sendResponse({
        res,
        data: masjids,
      });
    })
    .catch((err) => {
      next(err);
    });
};
router.get(
  "/",
  validate([
    query("fields").optional().isString().notEmpty(),
    query("page").optional().isNumeric().notEmpty(),
    query("limit").optional().isNumeric().notEmpty(),
    query("orderBy").optional().isString().notEmpty(),
    query("orderType").optional().isString().notEmpty(),
    query("search").optional().isString().notEmpty(),
  ]),
  getMasjid
);

const postMasjid = (req: Request, res: Response, next: NextFunction) => {
  const { nama_masjid, nama_ketua_dkm, no_hp } = req.body;
  return prisma.masjid
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
};
router.post(
  "/",
  validate([
    body("nama_masjid").notEmpty(),
    body("nama_ketua_dkm").notEmpty(),
    body("no_hp").notEmpty(),
  ]),
  postMasjid
);

router.get("/template", (req: Request, res: Response) => {
  res.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  const filePath = path.join("excelTemplates", "template_masjid.xlsx");
  res.download(filePath, "template_masjid.xlsx");
});

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  getExcelContent(req.body, "masjid")
    .then((data) =>
      prisma.masjid
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
    prisma.masjid
      .deleteMany({
        where: {
          id: {
            in: idArr,
          },
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

router.get(
  "/:id",
  validate([param("id").isNumeric().notEmpty()]),
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
    param("id").isNumeric().notEmpty(),
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

router.delete(
  "/:id",
  validate([param("id").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
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
  }
);

export default router;
