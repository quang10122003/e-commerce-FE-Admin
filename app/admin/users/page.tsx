import { UsersPageClient } from "./UsersPageClient";
import { getRoleUser } from "@/services/role-server.service";
import { safeFetch } from "@/services/server.service";
import {
  getAdminUsers,
  parseAdminUsersFilters,
} from "@/services/users-server.service";
import type { roleState, roleType } from "@/types/role/role";
import type { UserListData } from "@/types/user/User";

type UsersPageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminUsersFilters(resolvedSearchParams);

  // Lay id tu query edit de refresh trang van mo dung user dang sua.
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

  const [usersResult, rolesResult] = await Promise.all([
    safeFetch<UserListData>(
      () => getAdminUsers(filters),
      "Khong the tai danh sach user",
    ),
    safeFetch<roleType[]>(
      () => getRoleUser(),
      "Khong the tai roles",
    ),
  ]);

  const roleState: roleState = {
    data: rolesResult.data,
    isLoading: false,
    error: rolesResult.error,
  };

  return (
    <UsersPageClient
      editingUserId={editingUserId}
      errorMessage={usersResult.error}
      filters={filters}
      roleState={roleState}
      usersData={usersResult.data}
    />
  );
}
