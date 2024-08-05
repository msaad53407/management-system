import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(input?: string | null) {
  if (!input) return input;
  return input?.charAt(0).toUpperCase() + input?.slice(1);
}

export function capitalizeSentence(input?: string, separator = " ") {
  if (!input) return input;
  return input
    .split(separator)
    .map((word) => capitalize(word))
    .join(" ");
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

export function getDayLabelsForMonth(
  year: number,
  month: number
): { label: string; value: string }[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayLabels: { label: string; value: string }[] = [];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const ordinalNumbers = ["First", "Second", "Third", "Fourth"];

  const lastOccurrences: number[] = new Array(7).fill(0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    lastOccurrences[dayOfWeek] = day;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const weekNumber = Math.floor((day - 1) / 7);

    let labelPrefix: string;
    if (day === lastOccurrences[dayOfWeek]) {
      labelPrefix = "Last";
    } else {
      labelPrefix = ordinalNumbers[weekNumber];
    }

    const dayName = dayNames[dayOfWeek];
    const label = `${labelPrefix} ${dayName}`;
    const value = `${labelPrefix.toLowerCase()}-${dayName.toLowerCase()}`;

    if (weekNumber < 3 || labelPrefix === "Last") {
      dayLabels.push({ label, value });
    }
  }

  return dayLabels;
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
