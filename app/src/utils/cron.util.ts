import { CronJob, CronTime } from "cron";
import prisma from "./prisma.util";
import { $Enums } from "@prisma/client";
import {
  jumatanMessages,
  pengajianBulananMessages,
  pengajianMessages,
  transformPhoneMessageToSingle,
} from "./broadcast.util";
import { addToQueue } from "./waweb.util";
import { UTCToLocalTime, calculateNextJadwalBulanan } from "./etc.util";

const scheduleJobs = new Map<
  $Enums.template_t,
  {
    options: {
      force_broadcast: boolean;
      h: number;
      id_template?: bigint;
    };
    job: CronJob;
  }
>();

//auto delete message log every day if the message is more than 30 days old
const autoDeleteMessageLog = new CronJob("0 0 * * *", () => {
  prisma.message_logs
    .deleteMany({
      where: {
        send_time: {
          lt: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    })
    .then(() => {
      console.log("deleted message log");
    })
    .catch((err) => {
      console.log(err);
    });
});

export const startSchedule = ({
  type,
  active,
  force_broadcast,
  h,
  jam,
  id_template,
}: {
  type: $Enums.template_t;
  active: boolean;
  force_broadcast: boolean;
  h: number;
  jam: Date | string;
  id_template?: bigint;
}) => {
  //get hour and minute from jam
  const [hour, minute] = (jam instanceof Date ? jam.toTimeString() : jam).split(
    ":"
  );

  console.log(
    "Starting schedule for",
    type,
    "with",
    active,
    force_broadcast,
    h,
    hour,
    minute,
    id_template,
    calculateNextJadwalBulanan(h, hour, minute)
  );

  let job = scheduleJobs.get(type);
  const time =
    type === "pengajian_bulanan"
      ? calculateNextJadwalBulanan(h, hour, minute)
      : `${minute} ${hour} * * *`;

  // if job exists then stop it
  if (job?.job) {
    job.job.stop();
  }

  // if not active then let the job stop
  if (!active) {
    return;
  }

  // replace the job
  scheduleJobs.set(type, {
    options: {
      force_broadcast,
      h,
      id_template,
    },
    job: new CronJob(time, () => {
      sendReminder(type);

      if (type === "pengajian_bulanan") {
        startSchedule({
          type,
          active,
          force_broadcast,
          h,
          jam,
          id_template,
        });
      }
    }),
  });

  job = scheduleJobs.get(type);

  // replace the cron time
  job!.job.start();
  console.log("next date", job!.job.nextDate().diffNow().toHuman());
};

const sendReminder = (type: $Enums.template_t) => {
  console.log("Sending reminder for", type);
  const { h, force_broadcast, id_template } = scheduleJobs.get(type)?.options!;

  if (!id_template) {
    console.log("Canceling reminder because id_template is undefined");
    return;
  }

  switch (type) {
    case "pengajian_bulanan":
      // if h is 0 then in the range of this month
      // if h is more than 0 then in the range of next month
      let month = new Date().getMonth();
      if (h > 0) {
        month += 1;
      }

      pengajianBulananMessages({
        templateId: id_template,
        month: month,
        year: new Date(new Date().setMonth(month)).getFullYear(),
      })
        .then((messages) => {
          addToQueue(transformPhoneMessageToSingle(messages));
        })
        .catch((err) => {
          console.log(err);
        });
      break;

    case "pengajian_reminder":
      pengajianMessages({
        templateId: id_template,
        exactDate: new Date(new Date().setDate(new Date().getDate() + h)),
        includeBroadcasted: force_broadcast,
        changeStatusToBroadcasted: true,
      })
        .then((messages) => {
          if (messages.length > 0) {
            addToQueue(transformPhoneMessageToSingle(messages));
          }
        })
        .catch((err) => {
          console.log(err);
        });
      break;

    case "jumatan_reminder":
      jumatanMessages({
        templateId: id_template,
        exactDate: new Date(new Date().setDate(new Date().getDate() + h)),
        includeBroadcasted: force_broadcast,
        changeStatusToBroadcasted: true,
      })
        .then((messages) => {
          if (messages.length > 0) {
            addToQueue(transformPhoneMessageToSingle(messages));
          }
        })
        .catch((err) => {
          console.log(err);
        });
      break;

    default:
      break;
  }
};

export const initCron = () => {
  prisma.broadcast_schedule.findMany().then((broadcastSchedules) => {
    broadcastSchedules.forEach((broadcastSchedule) => {
      startSchedule({
        active: broadcastSchedule.active,
        force_broadcast: broadcastSchedule.force_broadcast,
        h: broadcastSchedule.h,
        jam: UTCToLocalTime(broadcastSchedule.jam),
        type: broadcastSchedule.id,
        id_template: broadcastSchedule.id_template || undefined,
      });
    });
  });

  autoDeleteMessageLog.start();
  console.log(
    "next delete message log",
    autoDeleteMessageLog.nextDate().diffNow().toHuman()
  );
};
