export function humanize(str: string) {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
}

export function formatDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}

export function formatDateTime(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    hour12: true,
  }).format(date);
}

export function templateReplacerBulanan(
  template: string,
  replacements: [string, string][][]
) {
  let result = template;
  if (/\[\[.*\]\]/s.test(template)) {
    const [_, brackets, insideBrackets] =
      template.match(/(\[\[([\s\S]*?)\]\])/)!;
    let insideContent = "";
    for (const replacement of replacements) {
      const temp = templateReplacer(insideBrackets, replacement);
      insideContent += temp;
    }
    result = template.replaceAll(brackets, insideContent);
  }
  const result2 = templateReplacer(result, replacements[0]);
  return result2;
}

export function templateReplacerBulananAggregate(
  template: string,
  replacements: [string, string][][]
) {
  let result = template;
  if (/\[\[.*\]\]/s.test(template)) {
    const [_, brackets, insideBrackets] =
      template.match(/(\[\[([\s\S]*?)\]\])/)!;
    let insideContent = "";
    let namaMasjid = "init";
    for (const replacement of replacements) {
      const temp = templateReplacer(insideBrackets, replacement);
      if (replacement[replacement.findIndex(innerArray => innerArray.includes("nama_masjid"))][1] !== namaMasjid && namaMasjid !== "init") {
        insideContent += "\n------------------------------\n";
      }
      insideContent += temp;
      namaMasjid = replacement[3][1];
    }
    result = template.replaceAll(brackets, insideContent);
  }
  const result2 = templateReplacer(result, replacements[0]);
  return result2;
}

export function templateReplacer(
  template: string,
  replacements: [string, string][]
) {
  for (const [key, value] of replacements) {
    template = template.replaceAll(`{{${key}}}`, value);
  }
  return template;
}

export function resetDateTimeToMidnight(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

export const calculateNextJadwalBulanan = (
  h: number,
  hour: string,
  minute: string
) => {
  let currentMonth = new Date().getMonth();

  let nextSchedule = new Date();
  nextSchedule.setHours(parseInt(hour));
  nextSchedule.setMinutes(parseInt(minute));
  nextSchedule.setSeconds(0);
  nextSchedule.setMilliseconds(0);

  do {
    nextSchedule = new Date(nextSchedule.setMonth(currentMonth));
    nextSchedule.setDate(1 - h);

    currentMonth++;
  } while (nextSchedule < new Date());

  return nextSchedule;
};
