import { UsersPageClient } from "./UsersPageClient";
import { getAdminUsersInitialData } from "@/features/user/services/admin-user-service";
import { buildUsersPageHref } from "@/lib/admin/users-url";
import { readSearchParam } from "@/lib/util/readSearchParam";
import { parseAdminUsersFilters } from "@/server/admin-users";
import { buildPathWithSearchParams } from "@/server/auth-refresh-redirect";
import type { NextSearchParams } from "@/types/next";
import { redirect } from "next/navigation";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const refreshRedirectPath = buildPathWithSearchParams("/admin/users", params);

  const filters = parseAdminUsersFilters(params);
  const editingId = Number(readSearchParam(params.edit));
  const editingUserId =
    Number.isFinite(editingId) && editingId > 0 ? editingId : null;
  const { data, error } = await getAdminUsersInitialData(
    filters,
    refreshRedirectPath,
  );
  const usersPage = data.users?.users;
  const totalPages = Math.max(usersPage?.totalPages ?? 1, 1);

  // Nếu URL yêu cầu page vượt tổng số trang, redirect về page cuối để fetch lại đúng data.
  if (usersPage && filters.currentPage > totalPages) {
    redirect(
      buildUsersPageHref({
        editingUserId,
        filters,
        page: totalPages,
      }),
    );
  }

  return (
    <UsersPageClient
      data={data}
      editingUserId={editingUserId}
      error={error}
      filters={filters}
    />
  );
}
