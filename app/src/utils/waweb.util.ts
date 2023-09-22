import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";
import puppeteer from "puppeteer";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

const data: {
  qr: string;
  state: WAWebJS.WAState | "LOADING";
} = {
  qr: "",
  state: "LOADING",
};

client.on("ready", () => {
  console.log("Client is ready!");
  data.qr = "";
});

client.on("change_state", (state) => {
  console.log("STATE", state);
  data.state = state;
});

client.initialize().then(() => {
  client.getState().then((state) => {
    console.log("STATE", state);
    data.state = state;
  });
});

export { client, data };
