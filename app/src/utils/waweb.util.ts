import { Client, LocalAuth } from "whatsapp-web.js";
import puppeteer from "puppeteer";
async function runPuppeteer() {
  try {
    console.log("start to run puppeter");
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the web page
    await page.goto("https://web.whatsapp.com/", {
      waitUntil: "load",
    });
    // await page.goto('https://simphony.com.co/');

    // const INTRO_QRCODE_SELECTOR = 'div[data-ref] canvas';
    // const resolved = await page.waitForSelector(INTRO_QRCODE_SELECTOR)
    // console.log("🚀 ~ file: index.js:28 ~ runPuppeteer ~ resolved:", resolved)

    // Take a screenshot
    await page.screenshot({ path: "example.png" });

    // Close the browser
    await browser.close();
    return true;
  } catch (error) {
    console.log("🚀 ~ file: index.js:29 ~ runPuppeteer ~ error:", error);
    return false;
  }
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

const data: {
  qr?: string;
} = {};
console.log("tes");
client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  data.qr = qr;
  console.log("QR RECEIVED", qr);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

export { client, data };
