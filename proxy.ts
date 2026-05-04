import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  ADMIN_ROLE,
  ROLE_COOKIE_KEY,
} from "@/server/auth-constants";

const LOGIN_PATH = "/login";
const ADMIN_HOME_PATH = "/admin/dashboard";

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(LOGIN_PATH, request.url);

  // Lưu route hiện tại để sau khi login có thể quay về đúng trang user đang muốn mở.
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === LOGIN_PATH;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const role = request.cookies.get(ROLE_COOKIE_KEY)?.value;

  const isAuthenticated = Boolean(accessToken);
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

  if (isLoginRoute && isAuthenticated && isAdmin) {
    return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
  }

  return NextResponse.next();
}

// Proxy chỉ canh gác route login và admin; API auth thật sự nằm trong Route Handler.
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
