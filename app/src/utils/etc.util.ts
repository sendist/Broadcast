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
  if (/\[\[.*\]\]/.test(template)) {
    const [_, brackets, insideBrackets] = template.match(/(\[\[([^\]]*)\]\])/)!;
    let insideContent = "";
    for (const replacement of replacements) {
      const temp = templateReplacer(insideBrackets, replacement);
      insideContent += temp;
    }
    result = template.replace(brackets, insideContent);
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
