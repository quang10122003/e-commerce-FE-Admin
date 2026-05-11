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
