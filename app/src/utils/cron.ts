import { CronJob, CronTime } from "cron";
import prisma from "./prisma.util";
import { $Enums } from "@prisma/client";
import { pengajianMessages, transformPhoneMessageToSingle } from "./broadcast";
import { addToQueue } from "./waweb.util";

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

const calculateNextJadwalBulanan = (
  h: number,
  hour: string,
  minute: string
) => {
  let currentMonth = new Date().getMonth();
  let nextSchedule = new Date();

  do {
    nextSchedule = new Date(new Date().setMonth(currentMonth));
    nextSchedule.setDate(1 - h);
    nextSchedule.setHours(parseInt(hour));
    nextSchedule.setMinutes(parseInt(minute));
    nextSchedule.setSeconds(0);
    nextSchedule.setMilliseconds(0);

    currentMonth++;
  } while (nextSchedule < new Date());

  return nextSchedule;
};

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
      job: new CronJob(time, () => sendReminder(type)),
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
  const { h, force_broadcast, id_template } = jobs.get(type)?.options!;

  if (!id_template) {
    console.log("Canceling broadcast because id_template is undefined");
    return;
  }

  switch (type) {
    case "pengajian_bulanan":
      // if h is 0 then in the range of this month
      // if h is more than 0 then in the range of next month
      const startDate = new Date(
        new Date().setMonth(new Date().getMonth() + (h === 0 ? 0 : 1))
      );
      startDate.setDate(1);
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      const endDate = new Date(
        new Date().setMonth(new Date().getMonth() + (h === 0 ? 1 : 2))
      );
      endDate.setDate(0);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      endDate.setMilliseconds(999);

      // prisma.pengajian.findMany({
      //   where: {
      //     tanggal: {
      //       gte: startDate,
      //       lte: endDate,
      //     },
      //   },
      // }).then((pengajians) => {
      //   pengajians.forEach((pengajian) => {
      //     const { id, tanggal, id_masjid, id_mubaligh } = pengajian;
      //     const template = getFilledTemplate("pengajian", {
      //       tanggal: tanggal.toISOString().split("T")[0],
      //       nama_masjid: id_masjid.nama,
      //       nama_mubaligh: id_mubaligh.nama,
      //     });
      //     const message = transformPhoneMessageToSingle(
      //       jumatanMessages.pengajian,
      //       template
      //     );
      //     addToQueue(message);
      //     prisma.pengajian.update({
      //       where: {
      //         id,
      //       },
      //       data: {
      //         broadcasted: true,
      //       },
      //     });
      //   });
      // }).catch((err) => {
      //   console.log(err);
      // });
      break;
    case "pengajian_reminder":
      pengajianMessages({
        templateId: id_template,
        exactDate: new Date(new Date().setDate(new Date().getDate() + h)),
      })
        .then((messages) => {
          addToQueue(transformPhoneMessageToSingle(messages));
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
      prisma.jumatan.findMany({
        where: {
          tanggal: {
            equals: new Date(new Date().setDate(new Date().getDate() + h)),
          },
          ...(!force_broadcast && { broadcasted: false }),
        },
      });
      break;
  }
};

// const initialize = () => {
//   prisma.broadcast_schedule.findMany().then((broadcastSchedules) => {
//     broadcastSchedules.forEach((broadcastSchedule) => {
//       const { id, cron } = broadcastSchedule;
//       const job = new CronJob(
//         cron,
//         () => {
//           console.log("cron job");
//         },
//         null,
//         true,
//         "Asia/Jakarta"
//       );
//       jobs.add(job);
//     });
//   });
// };
