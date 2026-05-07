import { UsersPageClient } from "./UsersPageClient";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { buildAdminUsersBackendPath, buildAdminUsersQueryParams, parseAdminUsersFilters } from "@/server/admin-users";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { NextSearchParams } from "@/types/next";
import type { AdminUsersFilters, UserListData } from "@/types/users";


// init data users trên server
async function getAdminUsersInitialData(filters: AdminUsersFilters) {
  try {
    const payload = await serverPrivateFetch<UserListData>(
      buildAdminUsersBackendPath(buildAdminUsersQueryParams(filters)),
    );

    return {
      data:payload.data,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error: getApiErrorMessage(e, "Không thể tải danh sách user."),
    };
  }
}

export default async function UsersPage({ searchParams }: {searchParams: NextSearchParams;}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminUsersFilters(resolvedSearchParams);
  const { data, error } = await getAdminUsersInitialData(filters);

  // Lấy id từ query edit để khi refresh trang vẫn mở đúng user đang sửa.
  const rawEditingUserId = Number.parseInt(
    Array.isArray(resolvedSearchParams.edit)
      ? (resolvedSearchParams.edit[0] ?? "")
      : (resolvedSearchParams.edit ?? ""),
    10,
  );

  const editingUserId =
    Number.isFinite(rawEditingUserId) && rawEditingUserId > 0
      ? rawEditingUserId
      : null;

  return (
    <UsersPageClient
      data={data}
      editingUserId={editingUserId}
      error={error}
      filters={filters}
      key={`${filters.search}:${filters.roleFilter}:${filters.statusFilter}:${filters.currentPage}:${editingUserId ?? "none"}`}
    />
  );
}

