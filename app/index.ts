import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authentication from "./src/middlewares/authentication.middleware";
import authRouter from "./src/routes/auth.route";
import waClientRoute from "./src/routes/waclient.route";
import masjidRoute from "./src/routes/masjid.route";
import mubalighRoute from "./src/routes/mubaligh.route";
import errorHandler from "./src/middlewares/errorHandler.middleware";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

//allow cors on non-production environments
if (process.env.NODE_ENV !== "production") {
  app.use((req: Request, res: Response, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
  });
}

app.use((req: Request, res: Response, next) => {
  res.header("content-type", "application/json");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//serve static assets if in production

// prefix all other routes with /api
const router = express.Router();
app.use("/api", router);

router.use("/auth", authRouter);

// all routes below this line will require authentication
router.use(authentication);

router.use("/waclient", waClientRoute);

router.use("/masjid", masjidRoute);

router.use("/mubaligh", mubalighRoute);

router.get("/protected", (req: Request, res: Response) => {
  res.send("You are authenticated");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));
  app.get("/*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});