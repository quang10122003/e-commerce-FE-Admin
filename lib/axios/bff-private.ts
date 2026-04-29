import { type AxiosInstance } from "axios";
import { createBaseApiClient } from "./base";
import { withDefaultRequestHeaders } from "./requestInterceptor";

type CreateBffPrivateApiClientOptions = {
  baseURL: string;
};

export function createBffPrivateApiClient({
  baseURL,
}: CreateBffPrivateApiClientOptions): AxiosInstance {
  const client = createBaseApiClient({ baseURL });

  client.interceptors.request.use(
    (config) => withDefaultRequestHeaders(config),
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => Promise.reject(error),
  );

  return client;
}
