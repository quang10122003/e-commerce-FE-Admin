const JAVA_LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?$/;

function readLocalDateTimeParts(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const match = JAVA_LOCAL_DATE_TIME_PATTERN.exec(value.trim());

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second = "0"] = match;
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

  return { day, hour, minute, month, year };
}

export function formatLocalDateTime(
  value: string | null | undefined,
  fallback = "_",
) {
  const parts = readLocalDateTimeParts(value);

  if (!parts) {
    return fallback;
  }

  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
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
