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
import { calculateNextJadwalBulanan } from "./etc.util";

const scheduleJobs = new Map<
  $Enums.template_t,
  {
    options: {
      force_broadcast: boolean;
      h: number;
      id_template_dkm?: bigint;
      id_template_mubaligh?: bigint;
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
  id_template_dkm,
  id_template_mubaligh,
}: {
  type: $Enums.template_t;
  active: boolean;
  force_broadcast: boolean;
  h: number;
  jam: Date | string;
  id_template_dkm?: bigint;
  id_template_mubaligh?: bigint;
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
    id_template_dkm,
    id_template_mubaligh,
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
      id_template_dkm,
      id_template_mubaligh,
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
          id_template_dkm,
          id_template_mubaligh,
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
  const { h, force_broadcast, id_template_dkm, id_template_mubaligh } =
    scheduleJobs.get(type)?.options!;

  switch (type) {
    case "pengajian_bulanan":
      // if h is 0 then in the range of this month
      // if h is more than 0 then in the range of next month
      let month = new Date().getMonth();
      if (h > 0) {
        month += 1;
      }

      pengajianBulananMessages({
        templateIdDKM: id_template_dkm,
        templateIdMubaligh: id_template_mubaligh,
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
        templateIdDKM: id_template_dkm,
        templateIdMubaligh: id_template_mubaligh,
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
        templateIdDKM: id_template_dkm,
        templateIdMubaligh: id_template_mubaligh,
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
        jam: broadcastSchedule.jam,
        type: broadcastSchedule.id,
        id_template_dkm: broadcastSchedule.id_template_dkm ?? undefined,
        id_template_mubaligh:
          broadcastSchedule.id_template_mubaligh ?? undefined,
      });
    });
  });

  autoDeleteMessageLog.start();
  console.log(
    "next delete message log",
    autoDeleteMessageLog.nextDate().diffNow().toHuman()
  );
};
