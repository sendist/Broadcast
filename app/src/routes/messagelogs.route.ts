import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { param, query } from "express-validator";
import { addToQueue } from "../utils/waweb.util";

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
    prisma.message_logs
      .findMany({
        ...(fields && {
          select: {
            id: fieldsArr?.includes("id"),
            message: fieldsArr?.includes("message"),
            no_hp: fieldsArr?.includes("no_hp"),
            error_reason: fieldsArr?.includes("error_reason"),
            status: fieldsArr?.includes("status"),
            send_time: fieldsArr?.includes("send_time"),
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
      .then((logs) => {
        sendResponse({
          res,
          data: logs,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.get(
  "/resend/:id",
  validate([param("id").isNumeric().notEmpty()]),
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    prisma.message_logs
      .findUnique({
        where: {
          id: BigInt(id),
        },
      })
      .then((message_log) => {
        if (message_log) {
          addToQueue({
            message: message_log.message,
            phone: message_log.no_hp,
          });
          sendResponse({
            res,
            data: message_log,
          });
        } else {
          sendResponse({
            res,
            error: "Message log not found",
            status: 404,
          });
        }
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
    prisma.message_logs
      .delete({
        where: {
          id: BigInt(id),
        },
      })
      .then((message_log) => {
        sendResponse({
          res,
          data: message_log,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
);

export default router;
