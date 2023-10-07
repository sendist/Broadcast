import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, param, query } from "express-validator";
import { humanize } from "../utils/etc.util";
import { $Enums } from "@prisma/client";

const router = express.Router();
router.get(
  "/",
  validate([
    query("fields").optional().isString().notEmpty(),
    query("page").optional().isNumeric().notEmpty(),
    query("limit").optional().isNumeric().notEmpty(),
    query("orderBy").optional().isString().notEmpty(),
    query("orderType").optional().isString().notEmpty(),
    query("type")
      .optional()
      .matches(new RegExp(`${Object.values($Enums.template_t).join("|")}`)),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, orderBy, orderType, fields, type } = req.query;
    const fieldsArr = fields ? fields.toString().split(",") : undefined;
    prisma.template
      .findMany({
        ...(type && {
          where: {
            type: type.toString() as $Enums.template_t,
          },
        }),
        ...(fields && {
          select: {
            id: fieldsArr?.includes("id"),
            nama_template: fieldsArr?.includes("nama_template"),
            content: fieldsArr?.includes("content"),
            type: fieldsArr?.includes("type"),
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
      .then((templates) => {
        sendResponse({
          res,
          data: templates,
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
    body("nama_template").isString().notEmpty(),
    body("content").isString().notEmpty(),
    body("type")
      .matches(new RegExp(`${Object.values($Enums.template_t).join("|")}`))
      .notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { nama_template, content, type } = req.body;
    prisma.template
      .create({
        data: {
          nama_template,
          content,
          type,
        },
      })
      .then((template) => {
        sendResponse({
          res,
          data: template,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

// router.post("/upload", (req: Request, res: Response) => {
//   const newObj = renameObjectKey(getContent(req.body), [
//     ["Nama Template", "nama_template"],
//     ["Content", "content"],
//     ["Type", "type"],
//   ]);
//   console.log(newObj);
//   prisma.template
//     .createMany({
//       data: newObj,
//     })
//     .then((template) => {
//       sendResponse({
//         res,
//         data: template,
//       });
//     });
// });

const templateEnum: {
  value: $Enums.template_t;
  label: string;
  replacements: string[];
  repetition: boolean;
}[] = [
  {
    value: "pengajian_bulanan",
    label: "Pengajian Bulanan",
    replacements: ["bulan", "tanggal", "waktu", "nama_masjid", "nama_mubaligh"],
    repetition: true,
  },
  {
    value: "pengajian_reminder",
    label: "Pengajian Reminder",
    replacements: ["tanggal", "waktu", "nama_masjid", "nama_mubaligh"],
    repetition: false,
  },
  {
    value: "jumatan_reminder",
    label: "Jumatan Reminder",
    replacements: ["tanggal", "nama_masjid", "nama_mubaligh"],
    repetition: false,
  },
];

router.get("/types", (req: Request, res: Response) => {
  sendResponse({
    res,
    data: templateEnum,
  });
});

router.get(
  "/:id",
  validate([param("id").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    prisma.template
      .findUnique({
        where: {
          id: BigInt(id),
        },
      })
      .then((template) => {
        sendResponse({
          res,
          data: template,
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
    body("nama_template").optional().isString(),
    body("content").optional().isString(),
    body("type")
      .optional()
      .matches(new RegExp(`${Object.values($Enums.template_t).join("|")}`)),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { nama_template, content, type } = req.body;
    prisma.template
      .update({
        where: {
          id: BigInt(id),
        },
        data: {
          nama_template,
          content,
          type,
        },
      })
      .then((template) => {
        sendResponse({
          res,
          data: template,
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
    prisma.template
      .delete({
        where: {
          id: BigInt(id),
        },
      })
      .then((template) => {
        sendResponse({
          res,
          data: template,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
