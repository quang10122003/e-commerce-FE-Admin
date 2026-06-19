import "server-only";

import type { ApiResponse } from "@/types/api";
import type { AuthResponse } from "@/types/auth";
import { buildBackendUrl } from "./backend-url";

type RefreshResponse = Pick<AuthResponse, "accessToken">;

// Đổi refresh token lấy access token mới từ backend.
export async function refreshAccessToken(refreshToken?: string) {
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(buildBackendUrl("/auth/refresh-token"), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      method: "GET",
    });

    const payload = (await response.json().catch(() => null)) as ApiResponse<RefreshResponse> | null;
    const nextAccessToken = payload?.data?.accessToken;

    if (!response.ok || !nextAccessToken) {
      return null;
    }

    return nextAccessToken;
  } catch {
    return null;
  }
}
