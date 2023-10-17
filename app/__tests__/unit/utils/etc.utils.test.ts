import * as etcUtil from "../../../src/utils/etc.util";

describe("etc.util Functions", () => {
  describe("humanize", () => {
    it("should humanize snake_case string", () => {
      const result = etcUtil.humanize("snake_case_string");
      expect(result).toBe("Snake Case String");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2023-10-16T12:00:00Z");
      const result = etcUtil.formatDate(date);
      expect(result).toBe("16 Oktober 2023");
    });
  });

  describe("formatDateTime", () => {
    it("should format date and time correctly", () => {
      const date = new Date("2023-10-16T12:00:00Z");
      const result = etcUtil.formatDateTime(date);

      // Set the expected result based on local time zone
      const expectedLocalTime = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
        hour12: true,
      }).format(date);

      expect(result).toBe(expectedLocalTime);
    });
  });

  describe("templateReplacerBulanan", () => {
    it("should replace template correctly with multiple replacements", () => {
      const template = "[[{{nama_mubaligh}}, {{nama_masjid}}, {{waktu}}, {{tanggal}}\n]]";
      const replacements: [string, string][][] =[[["nama_mubaligh","Budi"],["nama_masjid","Masjid A"],["waktu","ba'da ashar"],["tanggal","17 oktober 2023"]],[["nama_mubaligh","Budi"],["nama_masjid","Masjid A"],["waktu","ba'da isya"],["tanggal","27 oktober 2023"]]];

      const result = etcUtil.templateReplacerBulanan(template, replacements);
      expect(result).toBe("Budi, Masjid A, ba'da ashar, 17 oktober 2023\nBudi, Masjid A, ba'da isya, 27 oktober 2023\n");
    });
  });
  

  describe("templateReplacer", () => {
    it("should replace placeholders in the template correctly", () => {
      const template = "Diberitahukan untuk mubaligh {{nama_mubaligh}} akan ada pengajian pada {{tanggal}} pada waktu {{waktu}} di masjid {{nama_masjid}}.";
      const replacements:[string, string][] = [
        ["nama_mubaligh", "Budi"],
        ["tanggal", "30 Desember 2023"],
        ["waktu", "ba'da ashar"],
        ["nama_masjid", "Masjid A"],
      ];
      const result = etcUtil.templateReplacer(template, replacements);
      expect(result).toBe("Diberitahukan untuk mubaligh Budi akan ada pengajian pada 30 Desember 2023 pada waktu ba'da ashar di masjid Masjid A.");
    });
  });
});
