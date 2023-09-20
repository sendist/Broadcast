import { Client } from "whatsapp-web.js";

const client = new Client({});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
});

export default client;
