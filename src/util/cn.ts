import { twMerge } from "tailwind-merge";

export function cn(...classes: (string | undefined | boolean)[]): string {
  return twMerge(...classes.filter((clazz) => typeof clazz === "string"));
}
