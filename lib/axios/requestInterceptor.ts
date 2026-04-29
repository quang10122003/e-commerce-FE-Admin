import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

type DefaultRequestHeaderOptions = {
  accessToken?: string;
};

function shouldSetJsonContentType(
  config: InternalAxiosRequestConfig,
  headers: AxiosHeaders,
) {
  const method = config.method?.toLowerCase();
  const isMutatingMethod =
    method === "post" || method === "put" || method === "patch" || method === "delete";

  if (!isMutatingMethod) {
    return false;
  }

  if (headers.has("Content-Type") || config.data == null) {
    return false;
  }

  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    return false;
  }

  return true;
}

export function withDefaultRequestHeaders(
  config: InternalAxiosRequestConfig,
  options?: DefaultRequestHeaderOptions,
) {
  const headers = config.headers instanceof AxiosHeaders
    ? config.headers
    : new AxiosHeaders(config.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (shouldSetJsonContentType(config, headers)) {
    headers.set("Content-Type", "application/json");
  }

  if (options?.accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  config.headers = headers;
  return config;
}
