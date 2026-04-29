import { getApiErrorMessage } from "@/lib/axios/error";

type ServerFetchOptions = Omit<RequestInit, "body" | "headers"> & {
  accessToken?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

function normalizeApiPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}


// build header cho fetch gọi từ server lên backend
function buildServerFetchHeaders(options: ServerFetchOptions) {
  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (options.body && !headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  return headers;
}

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL_API;

  if (!baseURL) {
    throw new Error("Backend API base URL is not configured.");
  }

  const response = await fetch(`${baseURL}${normalizeApiPath(path)}`, {
    ...options,
    headers: buildServerFetchHeaders(options),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, "Yeu cau that bai. Vui long thu lai."));
  }

  return payload as T;
}
