import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";

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

export function sendMessage(
  phone: string,
  message: string
): Promise<WAWebJS.Message> {
  phone = phone.replace(/^0/, "62") + "@c.us";

  return client.getState().then((state) => {
    if (state === WAWebJS.WAState.CONNECTED) {
      client.isRegisteredUser(phone);
      return client.sendMessage(phone, message);
    } else {
      throw new Error("Client is not ready");
    }
  });
}

export { client, data };
