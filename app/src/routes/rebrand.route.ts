import express from "express";
import { Request, Response, NextFunction } from "../types/express.type";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body } from "express-validator";
import path from "path";
import fs from "fs";
import prisma from "../utils/prisma.util";

const router = express.Router();

export const ImageMimeType = {
  "image/x-jg": "art",
  "image/bmp": "dib",
  "image/gif": "gif",
  "image/ief": "ief",
  "image/jpeg": "jpg",
  "image/x-macpaint": "pnt",
  "image/x-portable-bitmap": "pbm",
  "image/pict": "pict",
  "image/x-portable-graymap": "pgm",
  "image/png": "png",
  "image/x-portable-anymap": "pnm",
  "image/x-portable-pixmap": "ppm",
  "image/vnd.adobe.photoshop": "psd",
  "image/x-quicktime": "qtif",
  "image/x-cmu-raster": "ras",
  "image/x-rgb": "rgb",
  "image/svg+xml": "svg",
  "image/tiff": "tiff",
  "image/x-xbitmap": "xbm",
  "image/x-xpixmap": "xpm",
  "image/x-xwindowdump": "xwd",
  "image/vnd.wap.wbmp": "wbmp",
} as { [key: string]: string };

const postName = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  prisma.customization
    .update({
      where: {
        key: "app_name",
      },
      data: {
        value: name,
      },
    })
    .then(() => {
      sendResponse({
        res,
        data: name,
      });
    })
    .catch((err) => {
      next(err);
    });
};

router.post("/name", validate([body("name").isString().notEmpty()]), postName);

const postLogo = (req: Request, res: Response, next: NextFunction) => {
  const image = req.body;
  const filetype =
    ImageMimeType[req.headers["content-type"] as string] || "jpg";
  const fileName = `custom-logo.${filetype}`;

  // Save the file to the public folder
  if (process.env.NODE_ENV === "production") {
    fs.writeFileSync(path.join(__dirname, `../client/${fileName}`), image);
  } else {
    fs.writeFileSync(
      path.join(__dirname, `../client/public/${fileName}`),
      image
    );
  }

  // Update the database
  prisma.customization
    .update({
      where: {
        key: "app_logo",
      },
      data: {
        value: fileName,
      },
    })
    .then(() => {
      sendResponse({
        res,
        data: fileName,
      });
    })
    .catch((err) => {
      next(err);
    });
};

router.post("/logo", postLogo);

const resetLogo = (req: Request, res: Response, next: NextFunction) => {
  prisma.customization
    .update({
      where: {
        key: "app_logo",
      },
      data: {
        value: "default-logo.svg",
      },
    })
    .then(() => {
      sendResponse({
        res,
        data: "default-logo.svg",
      });
    })
    .catch((err) => {
      next(err);
    });
};

router.delete("/logo", resetLogo);

export default router;
