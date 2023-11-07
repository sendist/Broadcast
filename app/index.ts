import express, { Request, Response, NextFunction } from "express";
import url from "url";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authentication from "./src/middlewares/authentication.middleware";
import authRoute from "./src/routes/auth.route";
import templateRoute from "./src/routes/template.route";
import waClientRoute, { waClientWs } from "./src/routes/waclient.route";
import masjidRoute from "./src/routes/masjid.route";
import jadwalPengajianRoute from "./src/routes/jadwalpengajian.route";
import jadwalJumatanRoute from "./src/routes/jadwaljumatan.route";
import mubalighRoute from "./src/routes/mubaligh.route";
import scheduleRoute from "./src/routes/schedule.route";
import messageLogsRoute from "./src/routes/messagelogs.route";
import manageAdminRoute from "./src/routes/manageadmin.route";
import errorHandler from "./src/middlewares/errorHandler.middleware";
import { verifyWSToken } from "./src/utils/jwt.util";
import prismaErrorHandler from "./src/middlewares/prismaErrorHandler.middleware";
import { initCron } from "./src/utils/cron.util";
dotenv.config();

const app = express();
export const port = process.env.PORT || 3000;

//support upload for excel files (xlsx)
app.use(
  bodyParser.raw({
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
);
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

// initialize cron jobs
initCron();

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

router.use("/template", templateRoute);

router.use("/waclient", waClientRoute);

router.use("/masjid", masjidRoute);

router.use("/mubaligh", mubalighRoute);

router.use("/jadwal-pengajian", jadwalPengajianRoute);

router.use("/jadwal-jumatan", jadwalJumatanRoute);

router.use("/schedule", scheduleRoute);

router.use("/message-logs", messageLogsRoute);

router.use("/manage-admin", manageAdminRoute);

//serve static assets if in production
if (process.env.NODE_ENV === "production") {
  console.log("serving static file for prodution use");
  app.use(express.static(path.join(__dirname, "client", "dist")));
  app.get("/*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

app.use(prismaErrorHandler);
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
    const { error } = verifyWSToken(token);
    if (error) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();

      return;
    }
    waClientWs.handleUpgrade(req, socket, head, (socket) => {
      waClientWs.emit("connection", socket, req);
    });
  } else {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});
