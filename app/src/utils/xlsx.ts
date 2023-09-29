import { read, writeFileXLSX, utils } from "xlsx";
const path = require("path");
// TODO: still temporary
export function saveExcel(data: any[]) {
  const filePath = path.join(
    "excelTemplates",
    new Date().getTime().toString() + ".xlsx"
  );
  const workSheet = utils.json_to_sheet(data);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "Sheet1");
  //save file
  writeFileXLSX(workBook, filePath, {
    bookType: "xlsx",
    type: "file",
  });
  return filePath;
}

export function getContent(buffer: any) {
  const workBook = read(buffer);
  const workSheet = workBook.Sheets[workBook.SheetNames[0]];
  const data = utils.sheet_to_json(workSheet);
  return data;
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
