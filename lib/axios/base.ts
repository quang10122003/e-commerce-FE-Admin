import axios, { type AxiosInstance } from "axios";

const API_REQUEST_TIMEOUT_MS = 30_000;

type CreateBaseApiClientOptions = {
  baseURL: string;
};

export function createBaseApiClient({
  baseURL,
}: CreateBaseApiClientOptions): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: API_REQUEST_TIMEOUT_MS,
    withCredentials: true,
  });
}
