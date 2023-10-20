import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import { $Enums } from "@prisma/client";
import validate from "../middlewares/validation.middleware";
import { body, param } from "express-validator";
import { startSchedule } from "../utils/cron.util";
import { UTCToLocalTime } from "../utils/etc.util";

const router = express.Router();
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  prisma.broadcast_schedule.findMany();

  prisma.broadcast_schedule
    .findMany()
    .then((schedules) => {
      // convert id to key of object
      const schedulesObj: Record<$Enums.template_t, any> = schedules.reduce(
        (acc, schedule) => {
          acc[schedule.id] = {
            ...schedule,
            jam: schedule.jam
              .toISOString()
              .split("T")[1]
              .split(".")[0]
              .split(":")
              .slice(0, 2)
              .join(":"),
            id: undefined,
          };
          return acc;
        },
        {} as Record<$Enums.template_t, any>
      );
      sendResponse({
        res,
        data: schedulesObj,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.patch(
  "/:id",
  validate([
    param("id").matches(
      new RegExp(`${Object.values($Enums.template_t).join("|")}`)
    ),
    body("active").optional().isBoolean().notEmpty(),
    body("force_broadcast").optional().isBoolean().notEmpty(),
    body("h").optional().isInt().notEmpty(),
    body("jam")
      .optional()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("id_template").optional().isNumeric().notEmpty(),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { active, force_broadcast, h, jam, id_template } = req.body;
    prisma.broadcast_schedule
      .update({
        where: {
          id: id as $Enums.template_t,
        },
        data: {
          ...(active !== undefined && {
            active: active as boolean,
          }),
          ...(force_broadcast !== undefined && {
            force_broadcast: force_broadcast,
          }),
          ...(h !== undefined && {
            h: h as number,
          }),
          ...(jam !== undefined && {
            jam: new Date(`1970-01-01T${jam}:00.000Z`),
          }),
          ...(id_template !== undefined && {
            id_template: BigInt(id_template),
          }),
        },
      })
      .then((schedule) => {
        startSchedule({
          type: id as $Enums.template_t,
          active: schedule.active,
          force_broadcast: schedule.force_broadcast,
          h: schedule.h,
          jam: UTCToLocalTime(schedule.jam),
          id_template: schedule.id_template!,
        });
        sendResponse({
          res,
          data: {
            ...schedule,
            jam: schedule.jam
              .toISOString()
              .split("T")[1]
              .split(".")[0]
              .split(":")
              .slice(0, 2)
              .join(":"),
            id: undefined,
          },
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
