import { isAxiosError } from "axios";

export const DEFAULT_AXIOS_ERROR_MESSAGE = "Yeu cau that bai. Vui long thu lai.";

export function getApiErrorMessage(
  payload: unknown,
  fallbackMessage = DEFAULT_AXIOS_ERROR_MESSAGE,
) {
  if (typeof payload === "object" && payload !== null) {
    if ("message" in payload && typeof payload.message === "string") {
      return payload.message;
    }

    if (
      "error" in payload &&
      typeof payload.error === "object" &&
      payload.error !== null &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
    ) {
      return payload.error.message;
    }
  }

  return fallbackMessage;
}

export function getAxiosErrorMessage(
  error: unknown,
  fallbackMessage = DEFAULT_AXIOS_ERROR_MESSAGE,
) {
  if (isAxiosError(error)) {
    return getApiErrorMessage(error.response?.data, fallbackMessage);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
