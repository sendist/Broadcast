import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, query, param } from "express-validator";
import { getExcelContent } from "../utils/xlsx.util";
import path from "path";

const router = express.Router();

const getJamaah = (req: Request, res: Response, next: NextFunction) => {
  // pagination (optional)
  const { page, limit, orderBy, orderType, search } = req.query;

  const { fields } = req.query;
  const fieldsArr = fields ? fields.toString().split(",") : undefined;
  return prisma.jamaah
    .findMany({
      ...(fields && {
        select: {
          id: fieldsArr?.includes("id"),
          nama_jamaah: fieldsArr?.includes("nama_jamaah"),
          no_hp: fieldsArr?.includes("no_hp"),
        },
      }),
      ...(search && {
        where: {
          nama_jamaah: {
            contains: search.toString(),
              mode: "insensitive",
          }, 
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
    .then((jamaahs) => {
      sendResponse({
        res,
        data: jamaahs,
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
  getJamaah
);

const postJamaah = (req: Request, res: Response, next: NextFunction) => {
  const { nama_jamaah, no_hp } = req.body;
  return prisma.jamaah
    .create({
      data: {
        nama_jamaah,
        no_hp,
      },
    })
    .then((jamaah) => {
      sendResponse({
        res,
        data: jamaah,
      });
    })
    .catch((err) => {
      next(err);
    });
};
router.post(
  "/",
  validate([
    body("nama_jamaah").notEmpty(),
    body("no_hp").notEmpty(),
  ]),
  postJamaah
);

router.get("/template", (req: Request, res: Response) => {
  res.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  const filePath = path.join("excelTemplates", "template_jamaah.xlsx");
  res.download(filePath, "template_jamaah.xlsx");
});

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  getExcelContent(req.body, "jamaah")
    .then((data) =>
      prisma.jamaah
        .createMany({
          data,
        })
        .then((jamaah) => {
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
    prisma.jamaah
      .deleteMany({
        where: {
          id: {
            in: idArr,
          },
        },
      })
      .then((jamaah) => {
        sendResponse({
          res,
          data: jamaah,
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
    prisma.jamaah
      .findUnique({
        where: {
          id: BigInt(id),
        },
      })
      .then((jamaah) => {
        sendResponse({
          res,
          data: jamaah,
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
    body("nama_jamaah").optional().isString(),
    body("no_hp").optional().isString(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { nama_jamaah, no_hp } = req.body;
    prisma.jamaah
      .update({
        where: {
          id: BigInt(id),
        },
        data: {
          nama_jamaah,
          no_hp,
        },
      })
      .then((jamaah) => {
        sendResponse({
          res,
          data: jamaah,
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
    prisma.jamaah
      .delete({
        where: {
          id: BigInt(id),
        },
      })
      .then((jamaah) => {
        sendResponse({
          res,
          data: jamaah,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
