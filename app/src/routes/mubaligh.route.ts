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
  prisma.mubaligh.findMany().then((mubalighs) => {
    sendResponse({
      res,
      data: mubalighs,
    });
  });
});

router.post(
  "/",
  validate([
    body("nama_mubaligh").notEmpty(),
    body("no_hp").notEmpty(),
  ]),
  (req: Request, res: Response) => {
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
      });
  }
);
// TODO: still temporary
router.get("/template", (req: Request, res: Response) => {
  res.header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  const filePath = path.join("excelTemplates", "template_mubaligh.xlsx");
  res.download(filePath, "template_mubaligh.xlsx");
});

router.post("/upload", (req: Request, res: Response) => {
  const newObj = renameObjectKey(getContent(req.body), [
    ["Nama Mubaligh", "nama_mubaligh"],
    ["No. HP", "no_hp"],
  ]);
  console.log(newObj);
  prisma.mubaligh
    .createMany({
      data: newObj,
    })
    .then((mubaligh) => {
      sendResponse({
        res,
        data: mubaligh,
      });
    });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  prisma.mubaligh
    .findUnique({
      where: {
        id: parseInt(id),
      },
    })
    .then((mubaligh) => {
      sendResponse({
        res,
        data: mubaligh,
      });
    });
});

router.patch(
  "/:id",
  validate([
    body("nama_mubaligh").optional().isString(),
    body("no_hp").optional().isString(),
  ]),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama_mubaligh,no_hp } = req.body;
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
      });
  }
);

router.delete("/:id", (req: Request, res: Response) => {
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
    });
});

export default router;