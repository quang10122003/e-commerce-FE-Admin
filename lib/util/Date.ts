import { RevenueFilters } from "@/types/revenue";

const LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

type LocalDateTimeParts = {
  day: string;
  hasTime: boolean;
  hour: string;
  minute: string;
  month: string;
  year: string;
};

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function toPartsFromDate(date: Date): LocalDateTimeParts | null {
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  // Fallback for ISO strings with timezone that need native Date parsing.
  return {
    day: padDatePart(date.getDate()),
    hasTime: true,
    hour: padDatePart(date.getHours()),
    minute: padDatePart(date.getMinutes()),
    month: padDatePart(date.getMonth() + 1),
    year: String(date.getFullYear()),
  };
}

function readLocalDateTimeParts(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const rawValue = value.trim();
  const match = LOCAL_DATE_TIME_PATTERN.exec(rawValue);

  if (!match) {
    return toPartsFromDate(new Date(rawValue));
  }

  // Keep Java LocalDateTime/date-only values stable by reading their parts directly.
  const [, year, month, day, hour = "00", minute = "00", second = "0"] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const isValidDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day) &&
    date.getHours() === Number(hour) &&
    date.getMinutes() === Number(minute) &&
    date.getSeconds() === Number(second);

  if (!isValidDate) {
    return null;
  }

  // Date-only inputs render without a fake 00:00 time in formatLocalDateTime.
  return { day, hasTime: Boolean(match[4]), hour, minute, month, year };
}

export function formatLocalDateTime(
  value: string | null | undefined,
  fallback = "_",
) {
  const parts = readLocalDateTimeParts(value);

  if (!parts) {
    return fallback;
  }

  const date = `${parts.day}/${parts.month}/${parts.year}`;

  return parts.hasTime ? `${date} ${parts.hour}:${parts.minute}` : date;
}

export function formatLocalDate(
  value: string | null | undefined,
  fallback = "_",
) {
  const parts = readLocalDateTimeParts(value);

  if (!parts) {
    return fallback;
  }

  return `${parts.day}/${parts.month}/${parts.year}`;
}







// Mảng tên tháng (dùng cho hiển thị)
export const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

/** Tính số tuần ISO của một ngày (tuần bắt đầu từ thứ 2) */
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Lấy ngày thứ 2 của tuần ISO trong năm */
export function getDateOfISOWeek(week: number, year: number): Date {
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dayOfWeek = simple.getUTCDay() || 7;
  const monday = new Date(simple);
  if (dayOfWeek <= 4) {
    monday.setUTCDate(simple.getUTCDate() - dayOfWeek + 1);
  } else {
    monday.setUTCDate(simple.getUTCDate() + 8 - dayOfWeek);
  }
  return monday;
}

/** Định dạng ngày dd/MM */
export function formatShortDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Tạo nhãn mô tả cho kỳ đang chọn (ví dụ: "Tuần 25/2026 (16/06 - 22/06)") */
export function getPeriodLabel(selection: RevenueFilters): string {
  if (selection.type === "WEEK") {
    const monday = getDateOfISOWeek(selection.week!, selection.year);
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    return `Tuần ${selection.week}/${selection.year} (${formatShortDate(monday)} - ${formatShortDate(sunday)})`;
  }
  if (selection.type === "MONTH") {
    return `${MONTH_NAMES[selection.month! - 1]}/${selection.year}`;
  }
  return `Năm ${selection.year}`;
}

/** Tạo nhãn cho kỳ liền trước (dùng trong biểu đồ so sánh) */

export function getPreviousPeriodLabel(selection: RevenueFilters): string {
  if (selection.type === "WEEK") {
    const prevWeek = selection.week === 1 ? 52 : selection.week! - 1;
    const prevYear = selection.week === 1 ? selection.year - 1 : selection.year;
    return `Tuần ${selection.week}/${selection.year} so với Tuần ${prevWeek}/${prevYear}`;
  }
  if (selection.type === "MONTH") {
    const prevMonth = selection.month === 1 ? 12 : selection.month! - 1;
    const prevYear = selection.month === 1 ? selection.year - 1 : selection.year;
    return `${MONTH_NAMES[selection.month! - 1]}/${selection.year} so với ${MONTH_NAMES[prevMonth - 1]}/${prevYear}`;
  }
  return `Năm ${selection.year} so với năm ${selection.year - 1}`;
}




