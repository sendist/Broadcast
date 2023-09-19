import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.post("/login", (req: Request, res: Response) => {
  const user = {
    id: 1,
    username: "brad",
    email: "",
  };
  res.send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
