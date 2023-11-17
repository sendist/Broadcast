import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { query } from "express-validator";

const router = express.Router();
router.get(
  "/",
  validate([
    query("page").optional().isNumeric().notEmpty(),
    query("limit").optional().isNumeric().notEmpty(),
    query("orderBy").optional().isString().notEmpty(),
    query("orderType").optional().isString().notEmpty(),
    query("month").optional().isNumeric().notEmpty(),
    query("dateStart").optional().isISO8601(),
    query("dateEnd").optional().isISO8601(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, orderBy, orderType, dateStart, dateEnd } = req.query;
    Promise.all([
      prisma.pengajian.findMany({
        where: {
          ...((dateStart || dateEnd) && {
            tanggal: {
              ...(dateStart && {
                gte: new Date(dateStart as string),
              }),
              ...(dateEnd && {
                lte: new Date(dateEnd as string),
              }),
            },
          }),
        },
        select: {
          tanggal: true,
          waktu: true,
          masjid: {
            select: {
              nama_masjid: true,
            },
          },
          mubaligh: {
            select: {
              nama_mubaligh: true,
            },
          },
        },
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
      }),
      prisma.jumatan.findMany({
        where: {
          ...((dateStart || dateEnd) && {
            tanggal: {
              ...(dateStart && {
                gte: new Date(dateStart as string),
              }),
              ...(dateEnd && {
                lte: new Date(dateEnd as string),
              }),
            },
          }),
        },
        select: {
          tanggal: true,
          masjid: {
            select: {
              nama_masjid: true,
            },
          },
          mubaligh: {
            select: {
              nama_mubaligh: true,
            },
          },
        },
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
      }),
    ])
      .then(([jadwalPengajians, jadwalJumatans]) => {
        sendResponse({
          res,
          data: {jadwalPengajians, jadwalJumatans},
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
