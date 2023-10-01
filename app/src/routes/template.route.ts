import express from "express";
import { Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, checkExact, checkSchema, param } from "express-validator";
import { getContent, renameObjectKey, saveExcel } from "../utils/xlsx";
import path from "path";

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  prisma.template.findMany().then((templates) => {
    sendResponse({
      res,
      data: templates,
    });
  });
});

router.post(
  "/",
  validate([
    body("nama_template").notEmpty(),
    body("content").notEmpty(),
  ]),
  (req: Request, res: Response) => {
    const { nama_template, content } = req.body;
    prisma.template
      .create({
        data: {
          nama_template,
          content,
        },
      })
      .then((template) => {
        sendResponse({
          res,
          data: template,
        });
      });
  }
);

router.post("/upload", (req: Request, res: Response) => {
  const newObj = renameObjectKey(getContent(req.body), [
    ["Nama Template", "nama_template"],
    ["Content", "content"],
  ]);
  console.log(newObj);
  prisma.template
    .createMany({
      data: newObj,
    })
    .then((template) => {
      sendResponse({
        res,
        data: template,
      });
    });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.template
    .findUnique({
      where: {
        id: parseInt(id),
      },
    })
    .then((template) => {
      sendResponse({
        res,
        data: template,
      });
    });
});

router.patch(
  "/:id",
  validate([
    body("nama_template").optional().isString(),
    body("content").optional().isString(),
  ]),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama_template, content} = req.body;
    prisma.template
      .update({
        where: {
          id: BigInt(id),
        },
        data: {
          nama_template,
          content,
        },
      })
      .then((template) => {
        sendResponse({
          res,
          data: template,
        });
      });
  }
);

router.delete("/:id", (req: Request, res: Response) => {
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
    });
});

export default router;