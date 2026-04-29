import { cookies } from "next/headers";
import { serverFetch } from "@/lib/fetch/server-fetch";
import { getApiErrorMessage } from "@/lib/axios/error";
import { ACCESS_TOKEN_COOKIE_KEY } from "@/lib/auth/constants";
import type { ApiResponseType } from "@/types/apiRepone/apiType";
import type {
  UserListData,
  AdminUsersQueryParams,
} from "@/types/user/User";

export const ADMIN_USERS_PAGE_SIZE = 10;

export type AdminUsersFilters = {
  currentPage: number;
  roleFilter: string;
  search: string;
  statusFilter: string;
};

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

function readSearchParam(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export function parseAdminUsersFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): AdminUsersFilters {
  const rawPage = Number.parseInt(readSearchParam(searchParams.page, "1"), 10);

  return {
    search: readSearchParam(searchParams.search).trim(),
    roleFilter: readSearchParam(searchParams.role, "ALL") || "ALL",
    statusFilter: readSearchParam(searchParams.status, "ALL") || "ALL",
    currentPage: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
  };
}

export function buildAdminUsersQueryParams(filters: AdminUsersFilters): AdminUsersQueryParams {
  return {
    search: filters.search || undefined,
    role: filters.roleFilter === "ALL" ? undefined : filters.roleFilter,
    status: filters.statusFilter === "ALL" ? undefined : filters.statusFilter,
    page: Math.max(filters.currentPage - 1, 0),
    size: ADMIN_USERS_PAGE_SIZE,
  };
}

export async function getAdminUsers(filters: AdminUsersFilters) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  const payload = await serverFetch<ApiResponseType<UserListData>>(
    buildAdminUsersBackendPath(buildAdminUsersQueryParams(filters)),
    {
      accessToken,
      cache: "no-store",
    },
  );

  if (!payload.success || !payload.data) {
    throw new Error(getApiErrorMessage(payload, "Khong the lay danh sach user"));
  }

  return payload.data;
}
