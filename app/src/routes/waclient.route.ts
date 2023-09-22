import express from "express";
import { Request, Response } from "../types/express.type";
import { client, data as clientData } from "../utils/waweb.util";
import sendResponse from "../utils/response.util";
import { WebSocketServer } from "ws";
import WAWebJS from "whatsapp-web.js";

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

//websocket
export const waClientWs = new WebSocketServer({
  path: "/api/waclient/connect",
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
});

export default router;
