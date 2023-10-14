import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, param, query } from "express-validator";
import { getExcelContent, renameObjectKey } from "../utils/xlsx.util";
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
    const { page, limit, orderBy, orderType } = req.query;

    const { fields } = req.query;
    const fieldsArr = fields ? fields.toString().split(",") : undefined;
    prisma.mubaligh
      .findMany({
        ...(fields && {
          select: {
            id: fieldsArr?.includes("id"),
            nama_mubaligh: fieldsArr?.includes("nama_mubaligh"),
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
      .then((mubalighs) => {
        sendResponse({
          res,
          data: mubalighs,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post(
  "/",
  validate([body("nama_mubaligh").notEmpty(), body("no_hp").notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
    const { nama_mubaligh, no_hp } = req.body;
    prisma.mubaligh
      .create({
        data: {
          nama_mubaligh,
          no_hp,
        },
      })
      .then((mubaligh) => {
        sendResponse({
          res,
          data: mubaligh,
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
  const filePath = path.join("excelTemplates", "template_mubaligh.xlsx");
  res.download(filePath, "template_mubaligh.xlsx");
});

router.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  getExcelContent(req.body, "mubaligh")
    .then((data) =>
      prisma.mubaligh
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
    prisma.mubaligh
      .deleteMany({
        where: {
          id: {
            in: idArr,
          },
        },
      })
      .then((mubaligh) => {
        sendResponse({
          res,
          data: mubaligh,
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
    prisma.mubaligh
      .findUnique({
        where: {
          id: BigInt(id),
        },
      })
      .then((mubaligh) => {
        sendResponse({
          res,
          data: mubaligh,
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
    body("nama_mubaligh").optional().isString(),
    body("no_hp").optional().isString(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { nama_mubaligh, no_hp } = req.body;
    prisma.mubaligh
      .update({
        where: {
          id: BigInt(id),
        },
        data: {
          nama_mubaligh,
          no_hp,
        },
      })
      .then((mubaligh) => {
        sendResponse({
          res,
          data: mubaligh,
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
    prisma.mubaligh
      .delete({
        where: {
          id: BigInt(id),
        },
      })
      .then((mubaligh) => {
        sendResponse({
          res,
          data: mubaligh,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
