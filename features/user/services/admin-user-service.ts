import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import {
  buildAdminUsersBackendPath,
  buildAdminUsersQueryParams,
} from "@/server/admin-users";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { rethrowSettledNextFrameworkErrors } from "@/server/next-framework-error";
import type { Role } from "@/types/roles";
import type { AdminUsersFilters, UserListData } from "@/types/users";

const ROLES_API = "/admin/roles";

export type AdminUsersInitialData = {
  roles: Role[] | null;
  users: UserListData | null;
};

export type AdminUsersInitialError = {
  errorRoles: string | null;
  errorUsers: string | null;
};

type AdminUsersInitialResult = {
  data: AdminUsersInitialData;
  error: AdminUsersInitialError;
};

// Gọi song song API users và roles để khởi tạo bảng, filter và form edit.
export async function getAdminUsersInitialData(
  filters: AdminUsersFilters,
  refreshRedirectPath?: string,
): Promise<AdminUsersInitialResult> {
  const [usersResult, rolesResult] = await Promise.allSettled([
    serverPrivateFetch<UserListData>(
      buildAdminUsersBackendPath(buildAdminUsersQueryParams(filters)),
      { refreshRedirectPath },
    ),
    serverPrivateFetch<Role[]>(ROLES_API, { refreshRedirectPath }),
  ]);

  rethrowSettledNextFrameworkErrors([usersResult, rolesResult]);

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
