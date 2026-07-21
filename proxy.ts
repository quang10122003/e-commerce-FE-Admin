import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  ADMIN_ROLE,
  AUTH_COOKIE_OPTIONS,
  REFRESHTOKEN_TOKEN_COOKIE_KEY,
  ROLE_COOKIE_KEY,
} from "@/server/auth-constants";
import { buildBackendUrl } from "@/server/backend-url";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse } from "@/types/auth";

const LOGIN_PATH = "/login";
const ADMIN_HOME_PATH = "/admin/dashboard";
type RefreshResponse = Pick<AuthResponse, "accessToken">;

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(LOGIN_PATH, request.url);

  // Lưu route hiện tại để sau khi login có thể quay về đúng trang user đang muốn mở.
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}

// Đổi refresh token lấy access token mới ngay trước khi render route admin.
async function refreshAccessTokenInProxy(refreshToken?: string) {
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

// Gắn token mới vào request hiện tại để Server Component đọc được ngay, không cần redirect.
function buildRequestHeadersWithAccessToken(
  request: NextRequest,
  accessToken: string,
) {
  const headers = new Headers(request.headers);
  const cookies = request.cookies
    .getAll()
    .filter((cookie) => cookie.name !== ACCESS_TOKEN_COOKIE_KEY)
    .map((cookie) => `${cookie.name}=${cookie.value}`);

  cookies.push(`${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);
  headers.set("cookie", cookies.join("; "));

  return headers;
}

// Trả tiếp request đã có token mới và ghi cookie xuống browser.
function nextWithAccessToken(request: NextRequest, accessToken: string) {
  const response = NextResponse.next({
    request: {
      headers: buildRequestHeadersWithAccessToken(request, accessToken),
    },
  });

  response.cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === LOGIN_PATH;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const refreshToken = request.cookies.get(REFRESHTOKEN_TOKEN_COOKIE_KEY)?.value;
  const role = request.cookies.get(ROLE_COOKIE_KEY)?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);
  const isAdmin = role === ADMIN_ROLE;

  if (isAdminRoute && !isAuthenticated) {
    return redirectToLogin(request);
  }

  if (isAdminRoute && !isAdmin) {
    const deniedUrl = new URL(LOGIN_PATH, request.url);
    deniedUrl.searchParams.set("reason", "forbidden");
    deniedUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(deniedUrl);
  }

  if (isAdminRoute && !accessToken && refreshToken) {
    // Access token bị xóa nhưng refresh token còn hợp lệ thì phục hồi trước khi page render.
    const nextAccessToken = await refreshAccessTokenInProxy(refreshToken);

    if (!nextAccessToken) {
      return redirectToLogin(request);
    }

    return nextWithAccessToken(request, nextAccessToken);
  }

  if (isLoginRoute && isAuthenticated && isAdmin) {
    return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
  }

  return NextResponse.next();
}

// Proxy chỉ canh gác route login và admin; API auth thật sự nằm trong Route Handler.
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
