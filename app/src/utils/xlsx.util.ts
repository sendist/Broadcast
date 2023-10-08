import { read, readFile, writeFileXLSX, utils, write, WorkBook } from "xlsx";
import ExcelJS from "exceljs";
const path = require("path");

export async function getFilledTemplate(
  tipeJadwal: "jumatan" | "pengajian",
  listMasjid: { id: bigint; nama_masjid: string }[],
  listMubaligh: { id: bigint; nama_mubaligh: string }[]
) {
  const templateName =
    tipeJadwal === "jumatan"
      ? "template_jadwaljumatan"
      : "template_jadwalpengajian";
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(
    path.join("excelTemplates", templateName + ".xlsx")
  );
  const worksheet = workbook.getWorksheet(2);
  const rowValues = [];
  for (let i = 0; i < Math.max(listMasjid.length, listMubaligh.length); i++) {
    const newRow = [];
    if (listMasjid[i]) {
      newRow[1] = listMasjid[i].id.toString();
      newRow[2] = listMasjid[i].nama_masjid;
    }
    if (listMubaligh[i]) {
      newRow[5] = listMubaligh[i].id.toString();
      newRow[6] = listMubaligh[i].nama_mubaligh;
    }
    rowValues.push(newRow);
  }
  worksheet.addRows(rowValues);
  worksheet.protect("", {});

  // add validation to worksheet 1
  const worksheet1 = workbook.getWorksheet(1);
  //@ts-ignore
  worksheet1.dataValidations.add(
    tipeJadwal === "jumatan" ? "B2:B1048576" : "C2:C1048576",
    {
      type: "list",
      allowBlank: true,
      formulae: [`='INFO KODE (JANGAN DIUBAH)'!$B$2:$B$1048576`],
    }
  );
  //@ts-ignore
  worksheet1.dataValidations.add(
    tipeJadwal === "jumatan" ? "C2:C1048576" : "D2:D1048576",
    {
      type: "list",
      allowBlank: true,
      formulae: [`='INFO KODE (JANGAN DIUBAH)'!$F$2:$F$1048576`],
    }
  );

  return await workbook.xlsx.writeBuffer({
    useStyles: true,
  });
}

export async function getExcelContent(
  buffer: Buffer,
  type: "jumatan"
): Promise<
  {
    tanggal: string;
    id_masjid: bigint;
    id_mubaligh: bigint;
  }[]
>;
export async function getExcelContent(
  buffer: Buffer,
  type: "pengajian"
): Promise<
  {
    tanggal: string;
    waktu: string;
    id_masjid: bigint;
    id_mubaligh: bigint;
  }[]
>;
export async function getExcelContent(
  buffer: Buffer,
  type: "masjid"
): Promise<
  {
    nama_masjid: string;
    nama_ketua_dkm: string;
    no_hp: string;
  }[]
>;
export async function getExcelContent(
  buffer: Buffer,
  type: "mubaligh"
): Promise<
  {
    nama_mubaligh: string;
    no_hp: string;
  }[]
>;
export async function getExcelContent(
  buffer: Buffer,
  type: "jumatan" | "pengajian" | "masjid" | "mubaligh"
) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const dataWorksheet = workbook.getWorksheet(1);

  if (["jumatan", "pengajian"].includes(type)) {
    const mappingWorksheet = workbook.getWorksheet(2);
    const listMasjid: Record<string, string> = {};
    const listMubaligh: Record<string, string> = {};
    (mappingWorksheet.getRows(2, mappingWorksheet.rowCount - 1) ?? []).forEach(
      (row) => {
        if ((row.values as string[])[1]) {
          listMasjid[(row.values as string[])[2]] = (row.values as string[])[1];
        }
        if ((row.values as string[])[5]) {
          listMubaligh[(row.values as string[])[6]] = (
            row.values as string[]
          )[5];
        }
      }
    );

    if (type === "jumatan") {
      const data: {
        tanggal: string;
        id_masjid: bigint;
        id_mubaligh: bigint;
      }[] = [];
      (dataWorksheet.getRows(2, dataWorksheet.rowCount - 1) ?? []).forEach(
        (row) => {
          console.log(row.values);
          data.push({
            tanggal: ((row.values as unknown[])[1] as Date).toISOString(),
            id_masjid: BigInt(listMasjid[(row.values as string[])[2]]),
            id_mubaligh: BigInt(listMubaligh[(row.values as string[])[3]]),
          });
        }
      );
      return data;
    } else if (type === "pengajian") {
      const data: {
        tanggal: string;
        waktu: string;
        id_masjid: bigint;
        id_mubaligh: bigint;
      }[] = [];
      (dataWorksheet.getRows(2, dataWorksheet.rowCount - 1) ?? []).forEach(
        (row) => {
          console.log(row.values);
          data.push({
            tanggal: ((row.values as unknown[])[1] as Date).toISOString(),
            waktu: (row.values as string[])[2],
            id_masjid: BigInt(listMasjid[(row.values as string[])[3]]),
            id_mubaligh: BigInt(listMubaligh[(row.values as string[])[4]]),
          });
        }
      );
      return data;
    }
  } else if (type === "masjid") {
    const data: {
      nama_masjid: string;
      nama_ketua_dkm: string;
      no_hp: string;
    }[] = [];
    (dataWorksheet.getRows(2, dataWorksheet.rowCount - 1) ?? []).forEach(
      (row) => {
        console.log(row.values);
        data.push({
          nama_masjid: (row.values as string[])[1],
          nama_ketua_dkm: (row.values as string[])[2],
          no_hp: (row.values as string[])[3],
        });
      }
    );
    return data;
  } else if (type === "mubaligh") {
    const data: {
      nama_mubaligh: string;
      no_hp: string;
    }[] = [];
    (dataWorksheet.getRows(2, dataWorksheet.rowCount - 1) ?? []).forEach(
      (row) => {
        console.log(row.values);
        data.push({
          nama_mubaligh: (row.values as string[])[1],
          no_hp: (row.values as string[])[2],
        });
      }
    );
    return data;
  }
  return [];
}

export function renameObjectKey(obj: any, changedKeys: [string, string][]) {
  const newObj: any = [];
  obj.forEach((o: any) => {
    const newO: any = {};
    Object.keys(o).forEach((key) => {
      const changedKey = changedKeys.find((k) => k[0] === key);
      if (changedKey) {
        newO[changedKey[1]] = o[key];
      } else {
        newO[key] = o[key];
      }
    });
    newObj.push(newO);
  });
  return newObj;
}
