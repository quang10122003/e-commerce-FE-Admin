import { UsersPageClient } from "./UsersPageClient";
import { getApiErrorMessage } from "@/lib/util/apiError";
import {
  buildAdminUsersBackendPath,
  buildAdminUsersQueryParams,
  parseAdminUsersFilters,
} from "@/server/admin-users";
import { serverPrivateFetch } from "@/server/backend-fetch";
import type { NextSearchParams } from "@/types/next";
import type { Role } from "@/types/roles";
import type { AdminUsersFilters, UserListData } from "@/types/users";

const ROLES_API = "/admin/roles";

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function getAdminUsersInitialData(filters: AdminUsersFilters) {
  const [usersResult, rolesResult] = await Promise.allSettled([
    serverPrivateFetch<UserListData>(
      buildAdminUsersBackendPath(buildAdminUsersQueryParams(filters)),
    ),
    serverPrivateFetch<Role[]>(ROLES_API),
  ]);

  return {
    data: {
      roles:
        rolesResult.status === "fulfilled" && rolesResult.value.success
          ? rolesResult.value.data
          : null,
      users:
        usersResult.status === "fulfilled" && usersResult.value.success
          ? usersResult.value.data
          : null,
    },
    error: {
      errorRoles:
        rolesResult.status === "rejected"
          ? getApiErrorMessage(rolesResult.reason, "Khong the tai roles.")
          : rolesResult.value.success
            ? null
            : getApiErrorMessage(rolesResult.value, "Khong the tai roles."),
      errorUsers:
        usersResult.status === "rejected"
          ? getApiErrorMessage(
              usersResult.reason,
              "Khong the tai danh sach user.",
            )
          : usersResult.value.success
            ? null
            : getApiErrorMessage(
                usersResult.value,
                "Khong the tai danh sach user.",
              ),
    },
  };
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const filters = parseAdminUsersFilters(params);
  const editingId = Number(getParamValue(params.edit));
  const editingUserId =
    Number.isFinite(editingId) && editingId > 0 ? editingId : null;
  const { data, error } = await getAdminUsersInitialData(filters);

  return (
    <UsersPageClient
      data={data}
      editingUserId={editingUserId}
      error={error}
      filters={filters}
    />
  );
}
