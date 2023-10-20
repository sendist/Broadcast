import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isDev = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

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

function textNodesUnder(el: HTMLElement) {
  let n;
  const a: HTMLElement[] = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  while ((n = walk.nextNode())) a.push(n as HTMLElement);
  return a;
}

export function whatsappFormatting(
  str: string,
  extendedFormatting?: {
    replacements: string[];
    repetition: boolean;
  }
): JSX.Element {
  const regexList = [
    {
      regex: /(?:```)(?:(?!\s))((?:(?!\n|```).)+)(?:```)/g,
      replacement: "<code>$1</code>",
    },
    {
      regex: /(?:\*)(?:(?!\s))((?:(?!\*|\n).)+)(?:\*)/g,
      replacement: "<b>$1</b>",
    },
    {
      regex: new RegExp(
        `(?:{{)(?:(?!\\s))((?:(?!\n|}})(${extendedFormatting?.replacements.join(
          "|"
        )}))+)(?:}})`,
        "g"
      ),
      replacement: "<span class='text-primary'>{{$1}}</span>",
    },
    {
      regex: /(?:_)(?:(?!\s))((?:(?!\n|_).)+)(?:_)/g,
      replacement: "<i>$1</i>",
    },
    {
      regex: /(?:~)(?:(?!\s))((?:(?!\n|~).)+)(?:~)/g,
      replacement: "<s>$1</s>",
    },
  ];
  // escape all html tags to prevent XSS
  str = escapeHtml(str);

  const tempDOM = document.createElement("div");
  tempDOM.innerHTML = str;
  regexList.forEach((regex) => {
    //get all text nodes
    const textNodes = textNodesUnder(tempDOM);
    //replace text nodes
    textNodes.forEach((node) => {
      const shouldReplace = regex.regex.test(node.textContent || "");
      if (!shouldReplace) return;

      const newNode = document.createElement("span");
      newNode.innerHTML =
        node.textContent?.replace(regex.regex, regex.replacement) || "";
      node.replaceWith(...newNode.childNodes);
    });
  });

  str = tempDOM.innerHTML;

  // str = (
  //   (extendedFormatting?.replacements?.length || 0) > 0
  //     ? str.replace(
  //         new RegExp(
  //           `(?:{{)(?:(?!\\s))((?:(?!\n|}})(${extendedFormatting?.replacements.join(
  //             "|"
  //           )}))+)(?:}})`,
  //           "g"
  //         ),
  //         // /(?:{{)(?:(?!\s))((?:(?!\n|}})(nama_mubaligh|masjid))+)(?:}})/g,
  //         "<span class='text-primary'>{{$1}}</span>"
  //       )
  //     : str
  // )
  //   .replace(/(?:```)(?:(?!\s))((?:(?!\n|```).)+)(?:```)/g, "<code>$1</code>")
  //   .replace(/(?:\*)(?:(?!\s))((?:(?!\*|\n).)+)(?:\*)/g, "<b>$1</b>")
  //   .replace(/(?:_)(?:(?!\s))((?:(?!\n|_).)+)(?:_)/g, "<i>$1</i>")
  //   .replace(/(?:~)(?:(?!\s))((?:(?!\n|~).)+)(?:~)/g, "<s>$1</s>");

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
    hour12: true,
  }).format(date);
}

export function compareObjectShallow<T extends { [key: string]: unknown }>(
  obj1: T,
  obj2: T
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => obj1[key] === obj2[key]);
}
