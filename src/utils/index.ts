import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(input?: string) {
  if (!input) return input;
  return input?.charAt(0).toUpperCase() + input?.slice(1);
}

export function formatDate(input?: string) {
  if (!input) return input;
  return new Date(input).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getMonth(input?: Date) {
  if (!input) return input;
  return new Date(input).toLocaleDateString("en-US", {
    month: "long",
  });
}

export function getYear(input?: Date) {
  if (!input) return input;
  return new Date(input).toLocaleDateString("en-US", {
    year: "numeric",
  });
}

export function getDay(input?: Date) {
  if (!input) return input;
  return new Date(input).toLocaleDateString("en-US", {
    day: "numeric",
  });
}
