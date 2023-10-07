import {
  NextFunction,
  Request,
  Response,
} from "../../../src/types/express.type";
import {
  authLogin,
  authLogout,
  authRefresh,
} from "../../../src/routes/auth.route";
import { prismaMock } from "../../../mock/prisma";

describe("authLogin controller", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  //   test("should return an error if no email is provided", async () => {
  //     const err = new Error("Test error");
  //     prismaMock.user.findUnique.mockRejectedValueOnce(err);
  //     await authLogin(req, res, next);
  //     expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
  //       where: {
  //         email: req.body.email,
  //       },
  //     });
  //     expect(next).toHaveBeenCalledWith(err);
  //   });
});
