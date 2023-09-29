import { Response } from "../types/express.type";
export default function sendResponse<T>({
  res,
  error = null,
  data = null,
  status,
}:
  | {
      res: Response;
      error?: null;
      data: T;
      status?: number;
    }
  | {
      res: Response;
      error: string;
      data?: null;
      status?: number;
    }) {
  return res.status(status ?? (error === null ? 200 : 500)).send({
    error,
    data,
  });
}
