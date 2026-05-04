import "server-only";

import { getApiErrorMessage } from "@/lib/util/api-error";
import {
  ADMIN_USERS_PAGE_SIZE,
  type AdminUsersFilters,
  type AdminUsersQueryParams,
  type UserListData,
} from "@/types/users";
import { serverPrivateFetch } from "./backend-fetch";

function readSearchParam(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export function buildAdminUsersSearchParams(params: AdminUsersQueryParams) {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (typeof params.page === "number") {
    searchParams.set("page", params.page.toString());
  }

  if (typeof params.size === "number") {
    searchParams.set("size", params.size.toString());
  }

  return searchParams;
}

export function buildAdminUsersBackendPath(params: AdminUsersQueryParams) {
  const searchParams = buildAdminUsersSearchParams(params);
  const queryString = searchParams.toString();

  return `/admin/users${queryString ? `?${queryString}` : ""}`;
}

// lấy query trên URL rồi chuyển thành object filter
export function parseAdminUsersFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): AdminUsersFilters {
  const rawPage = Number.parseInt(readSearchParam(searchParams.page, "1"), 10);

  return {
    currentPage: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    roleFilter: readSearchParam(searchParams.role, "ALL") || "ALL",
    search: readSearchParam(searchParams.search).trim(),
    statusFilter: readSearchParam(searchParams.status, "ALL") || "ALL",
  };
}

export function buildAdminUsersQueryParams(filters: AdminUsersFilters) {
  return {
    page: Math.max(filters.currentPage - 1, 0),
    role: filters.roleFilter === "ALL" ? undefined : filters.roleFilter,
    search: filters.search || undefined,
    size: ADMIN_USERS_PAGE_SIZE,
    status: filters.statusFilter === "ALL" ? undefined : filters.statusFilter,
  } satisfies AdminUsersQueryParams;
}

// Server Component có thể gọi trực tiếp backend mà không đi vòng qua Route Handler.
export async function getAdminUsers(filters: AdminUsersFilters) {
  const payload = await serverPrivateFetch<UserListData>(
    buildAdminUsersBackendPath(buildAdminUsersQueryParams(filters)),
  );

  if (!payload.success || !payload.data) {
    throw new Error(
      getApiErrorMessage(payload, "Không thể lấy danh sách user."),
    );
  }

  return payload.data;
}
