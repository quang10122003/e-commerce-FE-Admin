import "server-only";

import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import type { AuthResponse } from "@/types/auth";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  AUTH_COOKIE_OPTIONS,
  REFRESHTOKEN_MAX_AGE_SECONDS,
  REFRESHTOKEN_TOKEN_COOKIE_KEY,
  ROLE_COOKIE_KEY,
} from "./auth-constants";

export type AuthSession = {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
};

function cookieOptions(maxAge: number) {
  return {
    ...AUTH_COOKIE_OPTIONS,
    maxAge,
  };
}

// Đọc session trong Server Component hoặc trong các helper chạy phía server.
export async function getServerSession(): Promise<AuthSession> {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value,
    refreshToken: cookieStore.get(REFRESHTOKEN_TOKEN_COOKIE_KEY)?.value,
    role: cookieStore.get(ROLE_COOKIE_KEY)?.value,
  };
}

// Đọc session trực tiếp từ request đang đi qua Route Handler proxy.
export function getRequestSession(request: NextRequest): AuthSession {
  return {
    accessToken: request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)?.value,
    refreshToken: request.cookies.get(REFRESHTOKEN_TOKEN_COOKIE_KEY)?.value,
    role: request.cookies.get(ROLE_COOKIE_KEY)?.value,
  };
}

// Lưu access token mới sau login hoặc refresh token.
export function setAccessTokenSession(response: NextResponse, accessToken: string) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE_KEY,
    accessToken,
    cookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS),
  );
}

export function setLoginSession(response: NextResponse, auth: AuthResponse) {
  setAccessTokenSession(response, auth.accessToken);
  response.cookies.set(
    REFRESHTOKEN_TOKEN_COOKIE_KEY,
    auth.refreshToken,
    cookieOptions(REFRESHTOKEN_MAX_AGE_SECONDS),
  );

  response.cookies.set(
    ROLE_COOKIE_KEY,
    auth.role,
    cookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS),
  );
}

export function clearSession(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE_KEY, "", cookieOptions(0));
  response.cookies.set(ROLE_COOKIE_KEY, "", cookieOptions(0));
  response.cookies.set(REFRESHTOKEN_TOKEN_COOKIE_KEY, "", cookieOptions(0));
}
