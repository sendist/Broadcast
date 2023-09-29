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
