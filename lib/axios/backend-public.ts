import { type AxiosInstance } from "axios";
import { createBaseApiClient } from "./base";
import { withDefaultRequestHeaders } from "./requestInterceptor";

type CreateBackendPublicApiClientOptions = {
  baseURL: string;
};

export function createBackendPublicApiClient({
  baseURL,
}: CreateBackendPublicApiClientOptions): AxiosInstance {
  const client = createBaseApiClient({ baseURL });

  client.interceptors.request.use(
    (config) => withDefaultRequestHeaders(config),
    (error) => Promise.reject(error),
  );

  return client;
}
