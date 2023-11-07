import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, param, query } from "express-validator";

const router = express.Router();
router.get(
  "/",
  validate([
    query("fields").optional().isString().notEmpty(),
    query("page").optional().isNumeric().notEmpty(),
    query("limit").optional().isNumeric().notEmpty(),
    query("orderBy").optional().isString().notEmpty(),
    query("orderType").optional().isString().notEmpty(),
    query("dateStart").optional().isISO8601(),
    query("dateEnd").optional().isISO8601(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, orderBy, orderType, dateStart, dateEnd } = req.query;

    const { fields } = req.query;
    const fieldsArr = fields ? fields.toString().split(",") : undefined;
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
        orderBy: {
          id: "desc",
        },
        ...(orderBy && {
          orderBy: {
            [orderBy.toString()]: orderType?.toString() || "asc",
          },
        }),
      }),
      prisma.masjid.findMany({
        select: {
          id: true,
          nama_masjid: true,
        },
      }),
      prisma.mubaligh.findMany({
        select: {
          id: true,
          nama_mubaligh: true,
        },
      }),
    ])
      .then(([jadwalpengajians, masjids, mubalighs]) => {
      
        let tempPengajians: {
          waktu: string;
          masjid: string;
          mubaligh: string;
        }[] = [];

        const jadwalBulanan: {
          tanggal: number;
          pengajians: {
            waktu: string;
            masjid: string;
            mubaligh: string;
          }[];
        }[] = [];

        const endDateLastMonth = new Date( new Date().getFullYear(), new Date().getMonth(), 0).getDate()
        const endDateThisMonth = new Date( new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
        const startDayThisMonth  = new Date( new Date().getFullYear(), new Date().getMonth(), 1).getDay()
        const remainingDate = 35 - endDateThisMonth - startDayThisMonth

        for ( let i = endDateLastMonth - startDayThisMonth + 1; i <= endDateLastMonth; i++) {
          jadwalBulanan.push({
            tanggal: i,
            pengajians: []
          })
        }

        for ( let i = 1; i <= endDateThisMonth; i++) {
          let filteredPengajians = jadwalpengajians.filter(pengajian => pengajian.tanggal.getDate() === i)
          for (const pengajian of filteredPengajians) {
            tempPengajians.push({
              waktu: pengajian.waktu,
              masjid: masjids.find((masjid) => masjid.id === pengajian.id_masjid)
                ?.nama_masjid as string,
              mubaligh: mubalighs.find(
                (mubaligh) => mubaligh.id === pengajian.id_mubaligh
              )?.nama_mubaligh as string,
            });
          }
          jadwalBulanan.push({
            tanggal: i,
            pengajians: tempPengajians
          })
          tempPengajians = []
        }

        for ( let i = 1; i <= remainingDate; i++) {
          jadwalBulanan.push({
            tanggal: i,
            pengajians: []
          })
        }

        sendResponse({
          res,
          data: jadwalBulanan,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
