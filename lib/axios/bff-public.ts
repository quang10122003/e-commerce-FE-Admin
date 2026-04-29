import { type AxiosInstance } from "axios";
import { createBaseApiClient } from "./base";
import { withDefaultRequestHeaders } from "./requestInterceptor";

type CreateBffPublicApiClientOptions = {
  baseURL: string;
};

export function createBffPublicApiClient({
  baseURL,
}: CreateBffPublicApiClientOptions): AxiosInstance {
  const client = createBaseApiClient({ baseURL });

  client.interceptors.request.use(
    (config) => withDefaultRequestHeaders(config),
    (error) => Promise.reject(error),
  );

  return client;
}
