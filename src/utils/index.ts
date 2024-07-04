import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(input?: string) {
  if (!input) return input;
  return input?.charAt(0).toUpperCase() + input?.slice(1);
}
