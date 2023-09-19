import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.post("/login", (req: Request, res: Response) => {
  //implement login using email and password
  //implement jwt token and refresh token
  res.send();
});

app.post("refreshSession", (req: Request, res: Response) => {
  //implement refresh session using refreshToken
});

app.use((req: Request, res: Response, next) => {
  //implement jwt token verification
  next();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
