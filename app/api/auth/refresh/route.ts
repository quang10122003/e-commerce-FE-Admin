import { NextResponse, type NextRequest } from "next/server";

import { REFRESHTOKEN_TOKEN_COOKIE_KEY } from "@/server/auth-constants";
import { refreshAccessToken } from "@/server/auth-refresh";
import { markAuthRefreshedPath } from "@/server/auth-refresh-redirect";
import { clearSession, setAccessTokenSession } from "@/server/auth-session";

export const dynamic = "force-dynamic";

// Chỉ cho phép redirect về đường dẫn nội bộ của admin dashboard.
function normalizeInternalRoute(url?: string | null) {
  if (!url) {
    return null;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl.startsWith("/") || trimmedUrl.startsWith("//")) {
    return null;
  }

  return trimmedUrl;
}

// Lấy đích cần quay lại sau khi refresh token.
function getSafeNextPath(request: NextRequest) {
  const nextPath = request.nextUrl.searchParams.get("next");

  return normalizeInternalRoute(nextPath) ?? "/admin/dashboard";
}

// Tạo response redirect để có thể gắn Set-Cookie.
function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: NextRequest) {
  const nextPath = getSafeNextPath(request);
  const refreshToken = request.cookies.get(REFRESHTOKEN_TOKEN_COOKIE_KEY)?.value;

  if (!refreshToken) {
    const response = redirectTo(request, `/login?next=${encodeURIComponent(nextPath)}`);

    clearSession(response);

    return response;
  }

  const nextAccessToken = await refreshAccessToken(refreshToken);

  if (!nextAccessToken) {
    const response = redirectTo(request, `/login?next=${encodeURIComponent(nextPath)}`);

    clearSession(response);

    return response;
  }

  const response = redirectTo(request, markAuthRefreshedPath(request, nextPath));

  setAccessTokenSession(response, nextAccessToken);

  return response;
}
