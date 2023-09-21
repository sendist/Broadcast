import { Response } from "../types/express.type";
export default function sendResponse({
  res,
  error = null,
  data = null,
  status = 200,
}:
  | {
      res: Response;
      error?: null;
      data: unknown;
      status?: number;
    }
  | {
      res: Response;
      error: string;
      data?: null;
      status?: number;
    }) {
  return res.status(status).send({
    error,
    data,
  });
}
