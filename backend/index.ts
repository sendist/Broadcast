import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authentication from "./src/middlewares/authentication.middleware";
import authRouter from "./src/routes/auth.route";
import waClientRoute from "./src/routes/waclient.route";
import errorHandler from "./src/middlewares/errorHandler.middleware";
dotenv.config();

const app = express();
const port =
  process.env.NODE_ENV === "production" ? 80 : process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

//serve static assets if in production

app.use(express.static(path.join(__dirname, "src", "client", "dist")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "src", "client", "dist", "index.html"));
});

// prefix all other routes with /api
const router = express.Router();
app.use("/api", router);

router.use("/auth", authRouter);

// all routes below this line will require authentication
router.use(authentication);

router.use("/waclient", waClientRoute);

router.get("/protected", (req: Request, res: Response) => {
  res.send("You are authenticated");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
