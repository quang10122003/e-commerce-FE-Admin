import "server-only";

import { getApiErrorMessage } from "@/lib/util/api-error";
import type { Role } from "@/types/roles";
import { serverPrivateFetch } from "./backend-fetch";

const ADMIN_ROLES_PATH = "/admin/roles";

// Server Component có thể gọi trực tiếp backend để lấy role.
export async function getAdminRoles() {
  const payload = await serverPrivateFetch<Role[]>(ADMIN_ROLES_PATH);

  if (!payload.success || !payload.data) {
    throw new Error(
      getApiErrorMessage(payload, "Không thể lấy danh sách role."),
    );
  }

  return payload.data;
}
