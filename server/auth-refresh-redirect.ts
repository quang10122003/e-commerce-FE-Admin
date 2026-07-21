import type { NextRequest } from "next/server";
import type { NextSearchParams } from "@/types/next";

// Đánh dấu page request đã đi qua route refresh token.
export const AUTH_REFRESHED_SEARCH_PARAM = "__auth_refreshed";

// Đưa browser qua route refresh trước khi quay lại page.
export function buildAuthRefreshRoute(nextPath: string) {
  return `/api/auth/refresh?next=${encodeURIComponent(nextPath)}`;
}

// Dựng lại URL nội bộ của page để refresh xong quay về đúng bộ lọc hiện tại.
export function buildPathWithSearchParams(
  pathname: string,
  params: Awaited<NextSearchParams>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    if (value !== undefined) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

// Chặn vòng lặp refresh vô hạn khi backend vẫn từ chối request.
export function hasAuthRefreshMarker(path: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost";
  const url = new URL(path, domain);

  return url.searchParams.get(AUTH_REFRESHED_SEARCH_PARAM) === "1";
}

// Gắn marker vào URL quay lại sau khi refresh token thành công.
export function markAuthRefreshedPath(request: NextRequest, path: string) {
  const url = new URL(path, request.url);

  url.searchParams.set(AUTH_REFRESHED_SEARCH_PARAM, "1");

  return `${url.pathname}${url.search}${url.hash}`;
}
