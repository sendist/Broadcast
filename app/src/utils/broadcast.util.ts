import {
  formatDate,
  resetDateTimeToMidnight,
  templateReplacer,
  templateReplacerBulanan,
  templateReplacerBulananAggregate,
} from "./etc.util";
import prisma from "./prisma.util";

const listMonths = {
  0: "Januari",
  1: "Februari",
  2: "Maret",
  3: "April",
  4: "Mei",
  5: "Juni",
  6: "Juli",
  7: "Agustus",
  8: "September",
  9: "Oktober",
  10: "November",
  11: "Desember",
};

export const pengajianMessages = ({
  templateIdDKM,
  templateIdMubaligh,
  pengajianId,
  exactDate,
  includeBroadcasted = true,
  changeStatusToBroadcasted = false,
}:
  | {
      templateIdDKM?: bigint;
      templateIdMubaligh?: bigint;
      pengajianId: bigint[];
      exactDate?: undefined;
      includeBroadcasted?: boolean;
      changeStatusToBroadcasted?: boolean;
    }
  | {
      templateIdDKM?: bigint;
      templateIdMubaligh?: bigint;
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
    templateIdDKM !== undefined &&
      prisma.template.findUnique({
        where: {
          id: templateIdDKM,
        },
        select: {
          content: true,
        },
      }),
    templateIdMubaligh !== undefined &&
      prisma.template.findUnique({
        where: {
          id: templateIdMubaligh,
        },
        select: {
          content: true,
        },
      }),
  ]).then(([pengajians, templateDKM, templateMubaligh]) => {
    if (templateDKM === null || templateMubaligh === null) {
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
      if (templateDKM) {
        const message = templateReplacer(templateDKM.content, [
          ["tanggal", formatDate(pengajian.tanggal)],
          ["waktu", pengajian.waktu],
          ["nama_masjid", pengajian.masjid.nama_masjid],
          ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh],
          ["nama_ketua_dkm", pengajian.masjid.nama_ketua_dkm],
        ]);
        messages.push({
          phone: [pengajian.masjid.no_hp],
          recipients: [pengajian.masjid.nama_ketua_dkm],
          message: message,
        });
      }
      if (templateMubaligh) {
        const message = templateReplacer(templateMubaligh.content, [
          ["tanggal", formatDate(pengajian.tanggal)],
          ["waktu", pengajian.waktu],
          ["nama_masjid", pengajian.masjid.nama_masjid],
          ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh],
          ["nama_ketua_dkm", pengajian.masjid.nama_ketua_dkm],
        ]);
        messages.push({
          phone: [pengajian.mubaligh.no_hp],
          recipients: [pengajian.mubaligh.nama_mubaligh],
          message: message,
        });
      }
    }
    return messages;
  });

export const pengajianBulananMessages = ({
  templateIdDKM,
  templateIdMubaligh,
  month,
  year,
}: {
  templateIdDKM?: bigint;
  templateIdMubaligh?: bigint;
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
    templateIdDKM !== undefined &&
      prisma.template.findUnique({
        where: {
          id: templateIdDKM,
        },
        select: {
          content: true,
        },
      }),
    templateIdMubaligh !== undefined &&
      prisma.template.findUnique({
        where: {
          id: templateIdMubaligh,
        },
        select: {
          content: true,
        },
      }),
  ]).then(([pengajians, templateDKM, templateMubaligh]) => {
    if (templateDKM === null || templateMubaligh === null) {
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

    let masjidGroups: Record<
      string,
      { pengajians: (typeof pengajians)[number][]; mubalighs: Set<bigint> }
    > = {};

    let mubalighGroups: Record<
      string,
      { pengajians: (typeof pengajians)[number][]; masjids: Set<bigint> }
    > = {};

    for (const pengajian of pengajians) {
      if (masjidGroups[pengajian.masjid.id.toString()]) {
        masjidGroups[pengajian.masjid.id.toString()].pengajians.push(pengajian);
        masjidGroups[pengajian.masjid.id.toString()].mubalighs.add(
          pengajian.mubaligh.id
        );
      } else {
        masjidGroups[pengajian.masjid.id.toString()] = {
          pengajians: [pengajian],
          mubalighs: new Set([pengajian.mubaligh.id]),
        };
      }

      if (mubalighGroups[pengajian.mubaligh.id.toString()]) {
        mubalighGroups[pengajian.mubaligh.id.toString()].pengajians.push(pengajian);
        mubalighGroups[pengajian.mubaligh.id.toString()].masjids.add(pengajian.masjid.id);
      } else {
        mubalighGroups[pengajian.mubaligh.id.toString()] = {
          pengajians: [pengajian],
          masjids: new Set([pengajian.masjid.id]),
        };
      }
    }

    for (const [id, { pengajians, mubalighs }] of Object.entries(
      masjidGroups
    )) {
      if (templateDKM) {
        const replacements = pengajians.map((pengajian) => [
          ["bulan", listMonths[month as keyof typeof listMonths]],
          ["tanggal", formatDate(pengajian.tanggal)],
          ["waktu", pengajian.waktu],
          ["nama_masjid", pengajian.masjid.nama_masjid],
          ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh],
          ["nama_ketua_dkm", pengajian.masjid.nama_ketua_dkm],
        ]) as [string, string][][];
        messages.push({
          phone: [pengajians[0].masjid.no_hp],
          recipients: [pengajians[0].masjid.nama_ketua_dkm],
          message: templateReplacerBulanan(templateDKM.content, replacements),
        });
      }
    }

    for (const [id, { pengajians }] of Object.entries(mubalighGroups)) {
      pengajians.sort((a, b) => Number(a.masjid.id) - Number(b.masjid.id));
    }

    for (const [id, { pengajians, masjids }] of Object.entries(
      mubalighGroups
    )) {
      if (templateMubaligh) {
        const replacements = pengajians.map((pengajian) => [
          ["bulan", listMonths[month as keyof typeof listMonths]],
          ["tanggal", formatDate(pengajian.tanggal)],
          ["waktu", pengajian.waktu],
          ["nama_masjid", pengajian.masjid.nama_masjid],
          ["nama_mubaligh", pengajian.mubaligh.nama_mubaligh],
          ["nama_ketua_dkm", pengajian.masjid.nama_ketua_dkm],
        ]) as [string, string][][];
        messages.push({
          phone: [pengajians[0].mubaligh.no_hp],
          recipients: [pengajians[0].mubaligh.nama_mubaligh],
          message: templateReplacerBulananAggregate(templateMubaligh.content, replacements),
        });
      }
    }
    return messages;
  });

export const jumatanMessages = ({
  templateIdDKM,
  templateIdMubaligh,
  jumatanId,
  exactDate,
  includeBroadcasted = true,
  changeStatusToBroadcasted = false,
}:
  | {
      templateIdDKM?: bigint;
      templateIdMubaligh?: bigint;
      jumatanId: bigint[];
      exactDate?: undefined;
      includeBroadcasted?: boolean;
      changeStatusToBroadcasted?: boolean;
    }
  | {
      templateIdDKM?: bigint;
      templateIdMubaligh?: bigint;
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
    templateIdDKM !== undefined &&
      prisma.template.findUnique({
        where: {
          id: templateIdDKM,
        },
        select: {
          content: true,
        },
      }),
    templateIdMubaligh !== undefined &&
      prisma.template.findUnique({
        where: {
          id: templateIdMubaligh,
        },
        select: {
          content: true,
        },
      }),
  ]).then(([jumatans, templateDKM, templateMubaligh]) => {
    if (templateDKM === null || templateMubaligh === null) {
      throw new Error("Template tidak ditemukan");
    }
    if (!jumatans.length) {
      throw new Error("Jadwal jumatan tidak ditemukan");
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
      if (templateDKM) {
        const message = templateReplacer(templateDKM.content, [
          ["tanggal", formatDate(jumatan.tanggal)],
          ["nama_masjid", jumatan.masjid.nama_masjid],
          ["nama_mubaligh", jumatan.mubaligh.nama_mubaligh],
          ["nama_ketua_dkm", jumatan.masjid.nama_ketua_dkm],
        ]);
        messages.push({
          phone: [jumatan.masjid.no_hp],
          recipients: [jumatan.masjid.nama_ketua_dkm],
          message: message,
        });
      }
      if (templateMubaligh) {
        const message = templateReplacer(templateMubaligh.content, [
          ["tanggal", formatDate(jumatan.tanggal)],
          ["nama_masjid", jumatan.masjid.nama_masjid],
          ["nama_mubaligh", jumatan.mubaligh.nama_mubaligh],
          ["nama_ketua_dkm", jumatan.masjid.nama_ketua_dkm],
        ]);
        messages.push({
          phone: [jumatan.mubaligh.no_hp],
          recipients: [jumatan.mubaligh.nama_mubaligh],
          message: message,
        });
      }
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
