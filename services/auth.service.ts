"use client";

import { createBffPublicApiClient } from "@/lib/axios/bff-public";
import type { ApiResponseType } from "@/types/apiRepone/apiType";
import type { AuthResponse } from "@/types/auth/authRepone";
import type { LoginRequest } from "@/types/auth/loginRequest";

const publicBffClient = createBffPublicApiClient({
  baseURL: "/api/public",
});

export async function login(dataUser: LoginRequest) {
  const response = await publicBffClient.post<ApiResponseType<AuthResponse>>(
    "/auth/login",
    dataUser,
  );
  return response.data;
}

export async function logout() {
  const response = await publicBffClient.post<ApiResponseType<null>>("/auth/logout");
  return response.data;
}
