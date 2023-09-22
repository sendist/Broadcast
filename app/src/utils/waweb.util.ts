import { Client, LocalAuth } from "whatsapp-web.js";

const client = new Client({
  authStrategy: new LocalAuth(),
});

const data: {
  qr?: string;
} = {};

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  data.qr = qr;
  console.log("QR RECEIVED", qr);
});

export { client, data };
