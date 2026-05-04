import type { AdminUsersFilters } from "@/types/users";

export function buildUsersPageQuery(
  filters: AdminUsersFilters,
  editingUserId: number | null,
) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.roleFilter !== "ALL") {
    params.set("role", filters.roleFilter);
  }

  if (filters.statusFilter !== "ALL") {
    params.set("status", filters.statusFilter);
  }

  if (filters.currentPage > 1) {
    params.set("page", filters.currentPage.toString());
  }

  if (editingUserId) {
    params.set("edit", editingUserId.toString());
  }

  return params.toString();
}

export function formatUserDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("vi-VN");
}
