import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isStringJson(str: unknown) {
  if (typeof str !== "string") {
    return false;
  }
  try {
    const json = JSON.parse(str);
    if (typeof json === "object" && json !== null) {
      return json;
    }
  } catch (e) {
    return false;
  }
}

export function escapeHtml(str: string) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export function whatsappFormatting(str: string): JSX.Element {
  // escape all html tags to prevent XSS
  str = escapeHtml(str);

  str = str
    .replace(/(?:\*)(?:(?!\s))((?:(?!\*|\n).)+)(?:\*)/g, "<b>$1</b>")
    .replace(/(?:_)(?:(?!\s))((?:(?!\n|_).)+)(?:_)/g, "<i>$1</i>")
    .replace(/(?:~)(?:(?!\s))((?:(?!\n|~).)+)(?:~)/g, "<s>$1</s>")
    .replace(/(?:```)(?:(?!\s))((?:(?!\n|```).)+)(?:```)/g, "<code>$1</code>");

  return (
    <span
      className="whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: str }}
    />
  );
}

export function resetDateTimeToMidnight(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}

export function formatDate(date: Date | string, isFromDatabase?: boolean) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (isFromDatabase) {
    // add time zone offset
    new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
}

export function formatDateTime(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
