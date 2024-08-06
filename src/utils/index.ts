import { type ClassValue, clsx } from "clsx";
import { addHours, endOfMonth, startOfMonth } from "date-fns";
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

type DaysInMonth = 31 | 30 | 28 | 29;
export function getDaysInMonth(
  monthIndex: number,
  year = new Date().getFullYear()
): DaysInMonth {
  switch (monthIndex) {
    case 0: // January
    case 2: // March
    case 4: // May
    case 6: // July
    case 7: // August
    case 9: // October
    case 11: // December
      return 31;
    case 1: // February
      // Leap year check
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    case 3: // April
    case 5: // June
    case 8: // September
    case 10: // November
      return 30;
    default:
      throw new Error("Invalid month index. Must be between 0 and 11.");
  }
}

export function getMonth(input?: Date | string) {
  if (!input) return input;
  return new Date(input).toLocaleDateString("en-US", {
    month: "long",
  });
}

export function startOfMonthUTC(date: Date) {
  const localStartOfMonth = startOfMonth(date);
  return addHours(
    localStartOfMonth,
    -localStartOfMonth.getTimezoneOffset() / 60
  );
}

export function endOfMonthUTC(date: Date): Date {
  // Get the local end of the month
  const localEndOfMonth = endOfMonth(date);

  // Adjust for timezone to get the UTC end of the month
  return addHours(localEndOfMonth, -localEndOfMonth.getTimezoneOffset() / 60);
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
