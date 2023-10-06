import WAWebJS, { Client, LocalAuth } from "whatsapp-web.js";
import prisma from "./prisma.util";

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

export function sendMessage(phone: string, message: string): void {
  const convertedPhone = phone.replace(/^0/, "62") + "@c.us";
  // TODO masih ga masuk ke MESSAGE LOG
  client
    .getState()
    .then((state) => {
      state === WAWebJS.WAState.CONNECTED
        ? client
            .isRegisteredUser(convertedPhone)
            .then((isRegistered) => {
              isRegistered
                ? client
                    .sendMessage(convertedPhone, message)
                    .then((msg) => {
                      console.log("kekirim");
                      prisma.message_logs
                        .create({
                          data: {
                            message: message,
                            no_hp: phone,
                            status: "success",
                            send_time: new Date(),
                          },
                        })
                        .then(() => console.log("kekirim 2"));
                    })
                    .catch((err) => {
                      console.log("prisma error");
                      prisma.message_logs.create({
                        data: {
                          message: message,
                          no_hp: phone,
                          status: "failed",
                          error_reason: err?.message ?? String(err),
                          send_time: new Date(),
                        },
                      });
                    })
                : prisma.message_logs.create({
                    data: {
                      message: message,
                      no_hp: phone,
                      status: "failed",
                      error_reason: "User not registered in whatsapp",
                      send_time: new Date(),
                    },
                  });
            })
            .catch((err) => {
              prisma.message_logs.create({
                data: {
                  message: message,
                  no_hp: phone,
                  status: "failed",
                  error_reason: err?.message ?? String(err),
                  send_time: new Date(),
                },
              });
            })
        : prisma.message_logs.create({
            data: {
              message: message,
              no_hp: phone,
              status: "failed",
              error_reason: "Whatsapp not connected",
              send_time: new Date(),
            },
          });
    })
    .catch((err) => {
      prisma.message_logs.create({
        data: {
          message: message,
          no_hp: phone,
          status: "failed",
          error_reason: err?.message ?? String(err),
          send_time: new Date(),
        },
      });
    });
}

// SEND MESSAGE
let intervalFunc: NodeJS.Timeout | null = null;

const queue: {
  phone: string;
  message: string;
}[] = [];

// handle auto send
export function addToQueue([...toSend]: {
  phone: string;
  message: string;
}[]): void;
export function addToQueue({
  phone,
  message,
}: {
  phone: string;
  message: string;
}): void;

export function addToQueue(
  data:
    | { phone: string; message: string }
    | { phone: string; message: string }[]
) {
  if (Array.isArray(data)) {
    queue.push(...data);
  } else {
    const { phone, message } = data;
    queue.push({ phone, message });
  }

  if (!intervalFunc) {
    console.log("CREATING INTERVAL");
    intervalFunc = setInterval(() => {
      if (queue.length > 0) {
        const { phone, message } = queue.shift()!;
        sendMessage(phone, message);
        console.log("SENDING", phone, message);
      } else if (queue.length === 0 && intervalFunc) {
        clearInterval(intervalFunc);
        intervalFunc = null;
        console.log("ALL SENT");
      }
    }, 5000);
  }
}

export { client, data };
