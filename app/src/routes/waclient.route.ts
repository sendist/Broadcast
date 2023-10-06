import express from "express";
import { Request, Response } from "../types/express.type";
import {
  addToQueue,
  client,
  data as clientData,
  sendMessage,
} from "../utils/waweb.util";
import sendResponse from "../utils/response.util";
import { WebSocketServer } from "ws";
import WAWebJS from "whatsapp-web.js";
import { generateWSToken } from "../utils/jwt.util";
import { User } from "../types/user.type";
import validate from "../middlewares/validation.middleware";
import { body } from "express-validator";

const router = express.Router();

router.get("/qr", (req: Request, res: Response) => {
  client.getState().then((state) => {
    sendResponse({
      res,
      data: { qr: clientData.qr },
    });
  });
});

router.get("/logout", (req: Request, res: Response) => {
  client.logout().then(() => {
    sendResponse({
      res,
      data: { message: "Logout success" },
    });
  });
});

router.get("/connect", (req: Request, res: Response) => {
  //return short period token for WS
  const token = generateWSToken(req.user as User);
  sendResponse({
    res,
    data: { token },
  });
});

router.post(
  "/sanitycheck",
  validate([body("phone").isString().notEmpty()]),
  (req: Request, res: Response) => {
    const { phone } = req.body;
    addToQueue({
      phone: phone,
      message:
        "Sanity Check. If you receive this message, it means that the whatsapp client is running.",
    });
    sendResponse({
      res,
      data: { message: "OK" },
    });
  }
);

//websocket
export const waClientWs = new WebSocketServer({
  path: "/api/waclient/ws",
  noServer: true,
});

waClientWs.on("connection", (ws) => {
  const sendData = () => {
    ws.send(JSON.stringify(clientData));
  };
  sendData();

  const QRListener = (qr: string) => {
    console.log("QR", qr);
    clientData.qr = qr;
    sendData();
  };

  const stateListener = (state: WAWebJS.WAState) => {
    console.log("STATE", state);
    clientData.state = state;
    sendData();
  };

  const readyListener = () => {
    client.getState().then(stateListener);
  };

  ws.on("error", console.error);

  console.log("open");
  client.on("qr", QRListener);
  client.on("change_state", stateListener);
  client.on("ready", readyListener);

  ws.on("close", () => {
    console.log("close");
    client.off("qr", QRListener);
    client.off("change_state", stateListener);
    client.off("ready", readyListener);
  });
  ws.on("message", (message) => {
    if (message.toString() === "refresh") {
      sendData();
    }
  });

  ws.on("error", console.error);
});

export default router;
