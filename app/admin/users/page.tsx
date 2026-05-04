import { UsersPageClient } from "./UsersPageClient";
import { parseAdminUsersFilters } from "@/server/admin-users";

type UsersPageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminUsersFilters(resolvedSearchParams);

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
      editingUserId={editingUserId}
      filters={filters}
      key={`${filters.search}:${filters.roleFilter}:${filters.statusFilter}:${filters.currentPage}:${editingUserId ?? "none"}`}
    />
  );
}
