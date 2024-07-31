import { Roles } from "@/types/globals";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(input?: string) {
  if (!input) return input;
  return input?.charAt(0).toUpperCase() + input?.slice(1);
}

export function capitalizeRole(input: Roles) {
  const splittedRole = input.split("-");
  return capitalize(splittedRole[0]) + " " + (splittedRole[1] || "");
}

export function formatDate(
  input?: string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!input) return input;
  return new Date(input).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function getMonth(input?: Date | string) {
  if (!input) return input;
  return new Date(input).toLocaleDateString("en-US", {
    month: "long",
  });
}

export function getMonthName(monthIndex?: string) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (monthIndex === undefined) {
    const currentMonthIndex = new Date().getMonth();
    return monthNames[currentMonthIndex];
  }

  const index = parseInt(monthIndex, 10) - 1;

  if (isNaN(index) || index < 0 || index > 11) {
    throw new Error("Invalid month index");
  }

  return monthNames[index];
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
