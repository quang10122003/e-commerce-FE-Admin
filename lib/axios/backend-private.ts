import {
  AxiosHeaders,
  isAxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { createBaseApiClient } from "./base";
import { withDefaultRequestHeaders } from "./requestInterceptor";

type RefreshAuthResult = {
  accessToken: string;
  payload?: unknown;
};

type CreateBackendPrivateApiClientOptions = {
  accessToken?: string;
  baseURL: string;
  refreshAccessToken?: () => Promise<RefreshAuthResult | null>;
};

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export function createBackendPrivateApiClient({
  accessToken,
  baseURL,
  refreshAccessToken,
}: CreateBackendPrivateApiClientOptions): AxiosInstance {
  const client = createBaseApiClient({ baseURL });
  let currentAccessToken = accessToken;

  client.interceptors.request.use(
    (config) =>
      withDefaultRequestHeaders(config, {
        accessToken: currentAccessToken,
      }),
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const requestConfig = error.config as RetryableAxiosRequestConfig | undefined;

      if (
        !refreshAccessToken ||
        !requestConfig ||
        requestConfig._retry ||
        !isAxiosError(error) ||
        error.response?.status !== 401
      ) {
        return Promise.reject(error);
      }

      requestConfig._retry = true;
      const refreshResult = await refreshAccessToken();

      if (!refreshResult?.accessToken) {
        return Promise.reject(error);
      }

      currentAccessToken = refreshResult.accessToken;
      const headers = requestConfig.headers instanceof AxiosHeaders
        ? requestConfig.headers
        : new AxiosHeaders(requestConfig.headers);

      headers.set("Authorization", `Bearer ${refreshResult.accessToken}`);
      requestConfig.headers = headers;

      return client.request(requestConfig);
    },
  );

  return client;
}
