import {
  formatDate,
  resetDateTimeToMidnight,
  templateReplacer,
  templateReplacerBulanan,
} from "./etc.util";
import prisma from "./prisma.util";

export const pengajianMessages = ({
  templateId,
  pengajianId,
  exactDate,
  includeBroadcasted = true,
  changeStatusToBroadcasted = false,
}:
  | {
      templateId: bigint;
      pengajianId: bigint[];
      exactDate?: undefined;
      includeBroadcasted?: boolean;
      changeStatusToBroadcasted?: boolean;
    }
  | {
      templateId: bigint;
      pengajianId?: undefined;
      exactDate: Date;
      includeBroadcasted?: boolean;
      changeStatusToBroadcasted?: boolean;
    }) =>
  Promise.all([
    prisma.pengajian.findMany({
      where: {
        ...(pengajianId !== undefined
          ? {
              id: {
                in: pengajianId,
              },
            }
          : {}),
        ...(exactDate !== undefined
          ? {
              tanggal: {
                equals: resetDateTimeToMidnight(exactDate),
              },
            }
          : {}),
        ...(!includeBroadcasted ? { broadcasted: false } : {}),
      },
      select: {
        id: true,
        tanggal: true,
        waktu: true,
        masjid: {
          select: {
            no_hp: true,
            nama_ketua_dkm: true,
            nama_masjid: true,
          },
        },
        mubaligh: {
          select: {
            no_hp: true,
            nama_mubaligh: true,
          },
        },
      },
    }),
    prisma.template.findUnique({
      where: {
        id: templateId,
      },
      select: {
        content: true,
      },
    }),
  ]).then(([pengajians, template]) => {
    if (!template) {
      throw new Error("Template tidak ditemukan");
    }
    if (!pengajians.length) {
      throw new Error("Jadwal pengajian tidak ditemukan");
    }

    // change status to broadcasted
    if (changeStatusToBroadcasted) {
      prisma.pengajian
        .updateMany({
          where: {
            id: {
              in: pengajians.map((pengajian) => pengajian.id),
            },
          },
          data: {
            broadcasted: true,
          },
        })
        .then(() => {
          console.log(
            "changed to broadcasted",
            pengajians.map((pengajian) => pengajian.id)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }

    //process messages
    const messages: {
      phone: string[];
      recipients: string[];
      message: string;
    }[] = [];

    for (const pengajian of pengajians) {
      const message = templateReplacer(template.content, [
        ["tanggal", formatDate(pengajian.tanggal)],
        ["waktu", pengajian.waktu.toString()],
        ["nama_masjid", pengajian.masjid.nama_masjid.toString()],
        ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh.toString()],
      ]);
      messages.push({
        phone: [...new Set([pengajian.masjid.no_hp, pengajian.mubaligh.no_hp])],
        recipients: [
          ...new Set([
            pengajian.masjid.nama_ketua_dkm,
            pengajian.mubaligh.nama_mubaligh,
          ]),
        ],
        message: message,
      });
    }
    return messages;
  });

export const pengajianBulananMessages = ({
  templateId,
  month,
  year,
}: {
  templateId: bigint;
  month: number; // 0-11
  year: number;
  changeStatusToBroadcasted?: boolean;
}) =>
  Promise.all([
    prisma.pengajian.findMany({
      where: {
        tanggal: {
          gte: resetDateTimeToMidnight(new Date(year, +month, 1)),
          lt: resetDateTimeToMidnight(new Date(year, +month + 1, 1)),
        },
      },
      select: {
        id: true,
        tanggal: true,
        waktu: true,
        masjid: {
          select: {
            id: true,
            no_hp: true,
            nama_ketua_dkm: true,
            nama_masjid: true,
          },
        },
        mubaligh: {
          select: {
            id: true,
            no_hp: true,
            nama_mubaligh: true,
          },
        },
      },
      orderBy: {
        tanggal: "asc",
      },
    }),
    prisma.template.findUnique({
      where: {
        id: templateId,
      },
      select: {
        content: true,
      },
    }),
  ]).then(([pengajians, template]) => {
    if (!template) {
      throw new Error("Template tidak ditemukan");
    }
    if (!pengajians.length) {
      throw new Error(
        "Jadwal pengajian tidak ditemukan (mungkin dikarenakan tidak ada pengajian pada bulan tersebut)"
      );
    }

    const messages: {
      phone: string[];
      recipients: string[];
      message: string;
    }[] = [];

    let phoneAndReplacements: Record<
      string,
      {
        phone: Set<string>;
        recipients: Set<string>;
        replacements: [string, string][][];
      }
    > = {}; // masjidId: {phone: Set<phone>, replacements: replacements[]}

    for (const pengajian of pengajians) {
      const replacements: [string, string][] = [
        ["tanggal", formatDate(pengajian.tanggal)],
        ["waktu", pengajian.waktu.toString()],
        ["nama_masjid", pengajian.masjid.nama_masjid.toString()],
        ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh.toString()],
      ];

      if (phoneAndReplacements[pengajian.masjid.id.toString()]) {
        phoneAndReplacements[pengajian.masjid.id.toString()].replacements.push(
          replacements
        );
        phoneAndReplacements[pengajian.masjid.id.toString()].recipients.add(
          pengajian.mubaligh.nama_mubaligh
        );
        phoneAndReplacements[pengajian.masjid.id.toString()].phone.add(
          pengajian.mubaligh.no_hp
        );
      } else {
        phoneAndReplacements[pengajian.masjid.id.toString()] = {
          phone: new Set([pengajian.masjid.no_hp, pengajian.mubaligh.no_hp]),
          recipients: new Set([
            pengajian.masjid.nama_ketua_dkm,
            pengajian.mubaligh.nama_mubaligh,
          ]),
          replacements: [replacements],
        };
      }
    }
    for (const id in phoneAndReplacements) {
      messages.push({
        phone: [...phoneAndReplacements[id].phone],
        recipients: [...phoneAndReplacements[id].recipients],
        message: templateReplacerBulanan(
          template.content,
          phoneAndReplacements[id].replacements
        ),
      });
    }
    return messages;
  });

export const jumatanMessages = ({
  templateId,
  jumatanId,
  exactDate,
  includeBroadcasted = true,
  changeStatusToBroadcasted = false,
}:
  | {
      templateId: bigint;
      jumatanId: bigint[];
      exactDate?: undefined;
      includeBroadcasted?: boolean;
      changeStatusToBroadcasted?: boolean;
    }
  | {
      templateId: bigint;
      jumatanId?: undefined;
      exactDate: Date;
      includeBroadcasted?: boolean;
      changeStatusToBroadcasted?: boolean;
    }) =>
  Promise.all([
    prisma.jumatan.findMany({
      where: {
        ...(jumatanId !== undefined
          ? {
              id: {
                in: jumatanId,
              },
            }
          : {}),
        ...(exactDate
          ? {
              tanggal: {
                equals: resetDateTimeToMidnight(exactDate),
              },
            }
          : {}),
        ...(!includeBroadcasted ? { broadcasted: false } : {}),
      },
      select: {
        id: true,
        tanggal: true,
        masjid: {
          select: {
            no_hp: true,
            nama_ketua_dkm: true,
            nama_masjid: true,
          },
        },
        mubaligh: {
          select: {
            no_hp: true,
            nama_mubaligh: true,
          },
        },
      },
    }),
    prisma.template.findUnique({
      where: {
        id: templateId,
      },
      select: {
        content: true,
      },
    }),
  ]).then(([jumatans, template]) => {
    if (!template) {
      throw new Error("Template tidak ditemukan");
    }
    if (!jumatans.length) {
      throw new Error("Jadwal pengajian tidak ditemukan");
    }

    // change status to broadcasted
    if (changeStatusToBroadcasted) {
      prisma.jumatan
        .updateMany({
          where: {
            id: {
              in: jumatans.map((jumatan) => jumatan.id),
            },
          },
          data: {
            broadcasted: true,
          },
        })
        .then(() => {
          console.log(
            "changed to broadcasted",
            jumatans.map((jumatan) => jumatan.id)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const messages: {
      phone: string[];
      recipients: string[];
      message: string;
    }[] = [];
    for (const jumatan of jumatans) {
      const message = templateReplacer(template.content, [
        ["tanggal", formatDate(jumatan.tanggal)],
        ["nama_masjid", jumatan.masjid.nama_masjid],
        ["nama_mubaligh", jumatan.mubaligh.nama_mubaligh],
      ]);
      messages.push({
        phone: [...new Set([jumatan.masjid.no_hp, jumatan.mubaligh.no_hp])],
        recipients: [
          ...new Set([
            jumatan.masjid.nama_ketua_dkm,
            jumatan.mubaligh.nama_mubaligh,
          ]),
        ],
        message: message,
      });
    }
    return messages;
  });

export const transformPhoneMessageToSingle = (
  messages: {
    phone: string[];
    message: string;
  }[]
) => {
  const list: {
    phone: string;
    message: string;
  }[] = [];
  for (const message of messages) {
    for (const phone of message.phone) {
      list.push({
        phone: phone,
        message: message.message,
      });
    }
  }
  return list;
};
