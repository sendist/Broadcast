import { CronJob, CronTime } from "cron";
import prisma from "./prisma.util";
import { $Enums } from "@prisma/client";
import {
  jumatanMessages,
  pengajianMessages,
  transformPhoneMessageToSingle,
} from "./broadcast.util";
import { addToQueue } from "./waweb.util";
import {
  calculateNextJadwalBulanan,
  resetDateTimeToMidnight,
} from "./etc.util";

const jobs = new Map<
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

const startSchedule = ({
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

  let job = jobs.get(type);

  const time =
    type === "pengajian_bulanan"
      ? calculateNextJadwalBulanan(h, hour, minute)
      : `${minute} ${hour} * * *`;

  if (!job) {
    jobs.set(type, {
      options: {
        force_broadcast,
        h,
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
    job = jobs.get(type);
  }

  job!.job.stop();

  // replace the options
  job!.options = {
    force_broadcast,
    h,
    id_template,
  };

  // if not active then let the job stop
  if (!active) {
    return;
  }

  // replace the cron time
  job!.job.setTime(new CronTime(time));
  job!.job.start();
};

const sendReminder = (type: $Enums.template_t) => {
  console.log("Sending reminder for", type)
  const { h, force_broadcast, id_template } = jobs.get(type)?.options!;

  if (!id_template) {
    console.log("Canceling broadcast because id_template is undefined");
    return;
  }

  switch (type) {
    case "pengajian_bulanan":
      // if h is 0 then in the range of this month
      // if h is more than 0 then in the range of next month
      let startDate = new Date(
        new Date().setMonth(new Date().getMonth() + (h === 0 ? 0 : 1))
      );
      startDate.setDate(1);
      startDate = resetDateTimeToMidnight(startDate);
      let endDate = new Date(
        new Date().setMonth(new Date().getMonth() + (h === 0 ? 1 : 2))
      );
      endDate.setDate(0);
      endDate = resetDateTimeToMidnight(endDate);
      break;

    case "pengajian_reminder":
      pengajianMessages({
        templateId: id_template,
        exactDate: new Date(new Date().setDate(new Date().getDate() + h)),
        includeBroadcasted: force_broadcast,
      })
        .then((messages) => {
          if (messages.length > 0) {
            addToQueue(transformPhoneMessageToSingle(messages));
          }
        })
        .then(() => {
          prisma.pengajian
            .updateMany({
              where: {
                tanggal: {
                  equals: new Date(
                    new Date().setDate(new Date().getDate() + h)
                  ),
                },
                ...(!force_broadcast && { broadcasted: false }),
              },
              data: {
                broadcasted: true,
              },
            })
            .then(() => {
              console.log("broadcasted");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      prisma.pengajian
        .findMany({
          where: {
            tanggal: {
              equals: new Date(new Date().setDate(new Date().getDate() + h)),
            },
            ...(!force_broadcast && { broadcasted: false }),
          },
        })
        .then((pengajians) => {
          if (pengajians.length > 0) {
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
      })
        .then((messages) => {
          if (messages.length > 0) {
            addToQueue(transformPhoneMessageToSingle(messages));
          }
        })
        .then(() => {
          prisma.jumatan
            .updateMany({
              where: {
                tanggal: {
                  equals: new Date(
                    new Date().setDate(new Date().getDate() + h)
                  ),
                },
                ...(!force_broadcast && { broadcasted: false }),
              },
              data: {
                broadcasted: true,
              },
            })
            .then(() => {
              console.log("broadcasted");
            })
            .catch((err) => {
              console.log(err);
            });
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
        id_template: broadcastSchedule.id_template || undefined,
      });
    });
  });
};
