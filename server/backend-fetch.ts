import "server-only";

import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/lib/util/apiError";
import type { ApiResponse } from "@/types/api";
import { refreshAccessToken } from "./auth-refresh";
import { buildAuthRefreshRoute, hasAuthRefreshMarker } from "./auth-refresh-redirect";
import { getServerSession } from "./auth-session";

const BACKEND_URL =
  process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL_API;
const DEFAULT_TIMEOUT_MS = 30_000;

type JsonBody = Record<string, unknown> | unknown[];
type BackendRequestBody = BodyInit | JsonBody | null;
type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export type BackendFetchOptions = Omit<NextFetchOptions, "body" | "headers"> & {
  accessToken?: string;
  body?: BackendRequestBody;
  headers?: HeadersInit;
  refreshRedirectPath?: string;
  timeoutMs?: number;
};

type NormalizedBody = {
  body: BodyInit | null | undefined;
  isJson: boolean;
};

// buidld api backend 
function buildBackendUrl(path: string) {
  if (!BACKEND_URL) {
    throw new Error(
      "Chưa cấu hình BACKEND_API_BASE_URL hoặc NEXT_PUBLIC_BASE_URL_API.",
    );
  }

  return `${BACKEND_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

// Mang theo payload lỗi backend để nơi gọi xử lý theo status.
export class BackendResponseError extends Error {
  payload: unknown;
  status: number;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "BackendResponseError";
    this.payload = payload;
    this.status = status;
  }
}

function isJsonBody(body: BackendRequestBody | undefined): body is JsonBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return false;
  }

  if (body instanceof URLSearchParams || body instanceof Blob) {
    return false;
  }

  if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
    return false;
  }

  if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) {
    return false;
  }

  return true;
}

// chuẩn hóa body 
function normalizeBody(body: BackendRequestBody | undefined): NormalizedBody {
  if (body === undefined || body === null) {
    return { body, isJson: false };
  }

  if (isJsonBody(body)) {
    return { body: JSON.stringify(body), isJson: true };
  }

  return { body, isJson: false };
}

// tạo herder để gọi backend 
function buildHeaders(
  headersInit: HeadersInit | undefined,
  accessToken: string | undefined,
  hasJsonBody: boolean,
) {
  const headers = new Headers(headersInit);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const abortByCaller = () => controller.abort();

  if (init.signal?.aborted) {
    controller.abort();
  } else {
    init.signal?.addEventListener("abort", abortByCaller, { once: true });
  }

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
    init.signal?.removeEventListener("abort", abortByCaller);
  }
}

function toFetchInit(
  options: BackendFetchOptions,
  body: BodyInit | null | undefined,
  headers: Headers,
): NextFetchOptions {
  return {
    body,
    cache: options.cache ?? "no-store",
    credentials: options.credentials,
    headers,
    integrity: options.integrity,
    keepalive: options.keepalive,
    method: options.method,
    mode: options.mode,
    next: options.next,
    redirect: options.redirect,
    referrer: options.referrer,
    referrerPolicy: options.referrerPolicy,
    signal: options.signal,
  };
}

async function readJson<TData>(response: Response) {
  return (await response.json().catch(() => null)) as TData | null;
}

// Hàm thấp nhất để server gọi backend bằng fetch. Hàm này không làm refresh token.
export async function fetchBackendRaw(
  path: string,
  options: BackendFetchOptions = {},
) {

  const { body, isJson } = normalizeBody(options.body);
  const headers = buildHeaders(options.headers, options.accessToken, isJson);

  return fetchWithTimeout(
    buildBackendUrl(path),
    toFetchInit(options, body, headers),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
}

async function requestBackendJson<TData>(
  path: string,
  options: BackendFetchOptions,
): Promise<ApiResponse<TData>> {
  const response = await fetchBackendRaw(path, options);
  const payload = await readJson<ApiResponse<TData>>(response);

  if (!response.ok) {
    throw new BackendResponseError(
      getApiErrorMessage(payload, "Backend trả về lỗi. Vui lòng thử lại."),
      response.status,
      payload,
    );
  }

  if (!payload) {
    throw new Error("Backend không trả về JSON hợp lệ.");
  }

  return payload;
}

// Trục server public: gọi backend trực tiếp, không gửi token.
export function serverPublicFetch<TData>(
  path: string,
  options: Omit<BackendFetchOptions, "accessToken"> = {},
) {
  return requestBackendJson<TData>(path, options);
}

// Trục server private: gọi backend trực tiếp bằng access token trong cookie httpOnly.
export async function serverPrivateFetch<TData>(
  path: string,
  options: Omit<BackendFetchOptions, "accessToken"> = {},
) {
  const session = await getServerSession();
  let accessToken = session.accessToken;
  const refreshRedirectPath = options.refreshRedirectPath;
  const canRedirectToRefresh = refreshRedirectPath
    ? !hasAuthRefreshMarker(refreshRedirectPath)
    : false;

  if (!accessToken && session.refreshToken) {
    // Tự phục hồi trong request hiện tại; proxy chịu trách nhiệm ghi cookie mới cho browser.
    accessToken = (await refreshAccessToken(session.refreshToken)) ?? undefined;
  }

  try {
    return await requestBackendJson<TData>(path, {
      ...options,
      accessToken,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof BackendResponseError && error.status === 401 && session.refreshToken) {
      // Access token hết hạn thì refresh một lần rồi retry request ban đầu.
      if (refreshRedirectPath && canRedirectToRefresh) {
        redirect(buildAuthRefreshRoute(refreshRedirectPath));
      }

      const nextAccessToken = await refreshAccessToken(session.refreshToken);

      if (nextAccessToken) {
        return requestBackendJson<TData>(path, {
          ...options,
          accessToken: nextAccessToken,
          cache: "no-store",
        });
      }
    }

    throw error;
  }
}
