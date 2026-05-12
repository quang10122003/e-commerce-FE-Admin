import type { AdminUsersFilters } from "@/types/users";

type UsersPageHrefOptions = {
  editingUserId?: number | null;
  filters: AdminUsersFilters;
  page?: number;
};

// Tao URL canonical cho trang users, giu lai filter hien tai va chi them query khac mac dinh.
export function buildUsersPageHref({
  editingUserId = null,
  filters,
  page = filters.currentPage,
}: UsersPageHrefOptions) {
  const params = new URLSearchParams();
  const search = filters.search.trim();

  if (search) {
    params.set("search", search);
  }

  if (filters.roleFilter !== "ALL") {
    params.set("role", filters.roleFilter);
  }

  if (filters.statusFilter !== "ALL") {
    params.set("status", filters.statusFilter);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  if (editingUserId) {
    params.set("edit", String(editingUserId));
  }

  const query = params.toString();
  return `/admin/users${query ? `?${query}` : ""}`;
}
