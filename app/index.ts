import express, { Request, Response, NextFunction } from "express";
import url from "url";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authentication from "./src/middlewares/authentication.middleware";
import authRoute from "./src/routes/auth.route";
import waClientRoute, { waClientWs } from "./src/routes/waclient.route";
import masjidRoute from "./src/routes/masjid.route";
import mubalighRoute from "./src/routes/mubaligh.route";
import errorHandler from "./src/middlewares/errorHandler.middleware";
import { verifyWSToken } from "./src/utils/jwt.util";
dotenv.config();

const app = express();
export const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());

//allow cors on non-production environments
if (process.env.NODE_ENV !== "production") {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
  });
}

//serve static assets if in production

// prefix all other routes with /api
const router = express.Router();
app.use("/api", router);

router.use((req: Request, res: Response, next) => {
  res.header("content-type", "application/json");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

router.use("/auth", authRoute);

// all routes below this line will require authentication
router.use(authentication);
app.use(authentication);

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

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on("upgrade", (req, socket, head) => {
  // check JWT authentication from params "token" example: ?token=eyjhb...
  // if valid, upgrade the connection
  // else, close the connection
  const queries = url.parse(req.url || "", true).query;
  const token = queries.token;
  if (typeof token === "string") {
    const { error, data } = verifyWSToken(token);
    if (error) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    waClientWs.handleUpgrade(req, socket, head, (socket) => {
      waClientWs.emit("connection", socket, req);
    });
  }
  if (typeof token !== "string") throw new Error("Invalid token");
});
