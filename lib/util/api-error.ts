import type { ApiResponse } from "@/types/api";

const DEFAULT_ERROR_MESSAGE = "Yêu cầu thất bại. Vui lòng thử lại.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readMessage(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const message = value.message;

  return typeof message === "string" && message.trim() ? message : null;
}

function readApiResponseMessage(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const error = value.error;
  const errorMessage = isRecord(error) ? readMessage(error) : null;

  return errorMessage ?? readMessage(value);
}

// Chuẩn hóa mọi kiểu lỗi về một chuỗi hiển thị được cho UI và log phía server.
export function getApiErrorMessage(
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE,
) {
  if (!error) {
    return fallback;
  }

  const apiResponseMessage = readApiResponseMessage(error);

  if (apiResponseMessage) {
    return apiResponseMessage;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (isRecord(error) && "data" in error) {
    const dataMessage = readApiResponseMessage(error.data);

    if (dataMessage) {
      return dataMessage;
    }
  }

  if (isRecord(error) && "error" in error) {
    const serializedMessage = readMessage(error.error);

    if (serializedMessage) {
      return serializedMessage;
    }
  }

  return fallback;
}

export function buildErrorResponse(
  message: string,
): ApiResponse<null> {
  return {
    data: null,
    error: {
      errorCode: "NEXT_PROXY_ERROR",
      message,
    },
    message,
    success: false,
    timestamp: new Date().toISOString(),
  };
}
