import {
  formatDate,
  resetDateTimeToMidnight,
  templateReplacer,
} from "./etc.util";
import prisma from "./prisma.util";

export const pengajianMessages = ({
  templateId,
  pengajianId,
  startDate,
  endDate,
  exactDate,
  includeBroadcasted = true,
}:
  | {
      templateId: bigint;
      pengajianId: bigint[];
      startDate?: undefined;
      endDate?: undefined;
      exactDate?: undefined;
      includeBroadcasted?: boolean;
    }
  | {
      templateId: bigint;
      pengajianId?: undefined;
      startDate: Date;
      endDate: Date;
      exactDate?: undefined;
      includeBroadcasted?: boolean;
    }
  | {
      templateId: bigint;
      pengajianId?: undefined;
      startDate?: undefined;
      endDate?: undefined;
      exactDate: Date;
      includeBroadcasted?: boolean;
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
        ...(startDate !== undefined && endDate !== undefined
          ? {
              tanggal: {
                gte: resetDateTimeToMidnight(startDate),
                lte: resetDateTimeToMidnight(endDate),
              },
            }
          : {}),
        ...(!includeBroadcasted ? { broadcasted: false } : {}),
      },
      select: {
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
    if (!pengajians.length || !template) {
      throw new Error("Jadwal pengajian atau template tidak ditemukan");
    }

    const messages: {
      phone: string[];
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
        phone: [pengajian.masjid.no_hp, pengajian.mubaligh.no_hp],
        message: message,
      });
    }
    return messages;
  });

export const jumatanMessages = ({
  templateId,
  jumatanId,
  startDate,
  endDate,
  exactDate,
  includeBroadcasted = true,
}:
  | {
      templateId: bigint;
      jumatanId: bigint[];
      startDate?: undefined;
      endDate?: undefined;
      exactDate?: undefined;
      includeBroadcasted?: boolean;
    }
  | {
      templateId: bigint;
      jumatanId?: undefined;
      startDate: Date;
      endDate: Date;
      exactDate?: undefined;
      includeBroadcasted?: boolean;
    }
  | {
      templateId: bigint;
      jumatanId?: undefined;
      startDate?: undefined;
      endDate?: undefined;
      exactDate: Date;
      includeBroadcasted?: boolean;
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
        ...(startDate !== undefined && endDate !== undefined
          ? {
              tanggal: {
                gte: resetDateTimeToMidnight(startDate),
                lte: resetDateTimeToMidnight(endDate),
              },
            }
          : {}),
        ...(!includeBroadcasted ? { broadcasted: false } : {}),
      },
      select: {
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
    if (!jumatans.length || !template) {
      throw new Error("Jadwal jumatan atau template tidak ditemukan");
    }

    const messages: {
      phone: string[];
      message: string;
    }[] = [];
    for (const jumatan of jumatans) {
      const message = templateReplacer(template.content, [
        ["tanggal", formatDate(jumatan.tanggal)],
        ["nama_masjid", jumatan.masjid.nama_masjid],
        ["nama_mubaligh", jumatan.mubaligh.nama_mubaligh],
      ]);
      messages.push({
        phone: [jumatan.masjid.no_hp, jumatan.mubaligh.no_hp],
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
