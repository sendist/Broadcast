import express from "express";
import { NextFunction, Request, Response } from "../types/express.type";
import prisma from "../utils/prisma.util";
import sendResponse from "../utils/response.util";
import validate from "../middlewares/validation.middleware";
import { body, param, query } from "express-validator";
import { $Enums } from "@prisma/client";
import bcrypt from "bcrypt";

const router = express.Router();

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  // pagination (optional)
  const { page, limit, orderBy, orderType } = req.query;

  const { fields } = req.query;
  const fieldsArr = fields ? fields.toString().split(",") : undefined;
  if (req.user?.role !== "superadmin") {
    return sendResponse({
      res,
      error: "Not a superadmin!",
    });
  }

  return prisma.user
    .findMany({
      where: {
        role: $Enums.role_t.admin, // wajib admin, karena superadmin gak boleh manage superadmin lagi
      },

      select: {
        ...(fields
          ? {
              id: fieldsArr?.includes("id"),
              username: fieldsArr?.includes("username"),
            }
          : {
              id: true,
              username: true,
            }),
        password: false,
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
    })
    .then((users) => {
      sendResponse({
        res,
        data: users,
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
  ]),
  getUsers
);

const postUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (req.user?.role !== "superadmin") {
    return sendResponse({
      res,
      error: "Not a superadmin!",
    });
  }
  return bcrypt.hash(password, 10).then((hash) =>
    prisma.user
      .create({
        data: {
          username,
          password: hash,
          role: "admin",
        },
      })
      .then((user) => {
        sendResponse({
          res,
          data: { ...user, password: undefined },
        });
      })
      .catch((err) => {
        next(err);
      })
  );
};
router.post(
  "/",
  validate([body("username").notEmpty(), body("password").notEmpty()]),
  postUser
);

// router.get(
//     "/:id",
//     validate([param("id").isString().notEmpty()]),
//     (req: Request, res: Response, next: NextFunction) => {
//         const { id } = req.params;
// if (req.user?.role !== "superadmin") {
//     return sendResponse({
//         res,
//         error: "Not a superadmin!",
//     });
// }
//         prisma.user
//             .findUnique({
//                 where: {
//                     id: id
//                 },
//             })
//             .then((user) => {
//                 sendResponse({
//                     res,
//                     data: {...user, password: undefined },
//                 });
//             })
//             .catch((err) => {
//                 next(err);
//             });
//     }
// );

const patchUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { username, password } = req.body;

  if (req.user?.role !== "superadmin") {
    return sendResponse({
      res,
      error: "Not a superadmin!",
    });
  }

  return bcrypt.hash(password, 10).then((hash) =>
    prisma.user
      .update({
        where: {
          id: id,
        },
        data: {
          username,
          password: hash,
        },
      })
      .then((user) => {
        sendResponse({
          res,
          data: { ...user, password: undefined },
        });
      })
      .catch((err) => {
        next(err);
      })
  );
};
router.patch(
  "/:id",
  validate([
    param("id").isString().notEmpty(),
    body("username").optional().isString(),
    body("password").optional().isString(),
  ]),
  patchUser
);

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (req.user?.role !== "superadmin") {
    return sendResponse({
      res,
      error: "Not a superadmin!",
    });
  }

  prisma.user
    .delete({
      where: {
        id: id,
        role: $Enums.role_t.admin,
      },
    })
    .then((user) => {
      sendResponse({
        res,
        data: { ...user, password: undefined },
      });
    })
    .catch((err) => {
      next(err);
    });
};
router.delete(
  "/:id",
  validate([param("id").isString().notEmpty()]),
  deleteUser
);

export default router;
