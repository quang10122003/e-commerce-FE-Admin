import { buildUsersPageHref } from "@/lib/admin/users-url";
import type { AdminUsersInitialData } from "@/features/user/services/admin-user-service";
import type { AdminUsersFilters, UserItem, UserStats } from "@/types/users";
import type { RoleState } from "@/types/roles";

const EMPTY_STATS: UserStats = {
  adminUsers: 0,
  lockedUsers: 0,
  totalUsers: 0,
};

const EMPTY_USERS: UserItem[] = [];

type CreateAdminUsersViewModelInput = {
  data: AdminUsersInitialData;
  editingUserId: number | null;
  errorRoles: string | null;
  filters: AdminUsersFilters;
};

type AdminUsersPaginationViewModel = {
  currentPage: number;
  nextHref?: string;
  previousHref?: string;
  totalItems: number;
  totalPages: number;
};

export type AdminUsersViewModel = {
  activeUserId: number | null;
  closeEditHref: string;
  editingUser: UserItem | null;
  pagination: AdminUsersPaginationViewModel;
  roleState: RoleState;
  stats: UserStats;
  users: UserItem[];
};

// Tạo dữ liệu đã tính sẵn để component users chỉ tập trung render giao diện.
export function createAdminUsersViewModel({
  data,
  editingUserId,
  errorRoles,
  filters,
}: CreateAdminUsersViewModelInput): AdminUsersViewModel {
  const usersPage = data.users?.users;
  const users = usersPage?.items ?? EMPTY_USERS;
  const stats = data.users?.stats ?? EMPTY_STATS;
  const totalItems = usersPage?.totalItems ?? 0;
  const totalPages = Math.max(usersPage?.totalPages ?? 1, 1);
  const currentPage = Math.min(Math.max(filters.currentPage, 1), totalPages);
  const editingUser = editingUserId
    ? users.find((user) => user.id === editingUserId) ?? null
    : null;

  return {
    activeUserId: editingUser?.id ?? null,
    closeEditHref: buildUsersPageHref({
      filters,
      page: currentPage,
    }),
    editingUser,
    pagination: {
      currentPage,
      nextHref:
        currentPage < totalPages
          ? buildUsersPageHref({
              filters,
              page: currentPage + 1,
            })
          : undefined,
      previousHref:
        currentPage > 1
          ? buildUsersPageHref({
              filters,
              page: currentPage - 1,
            })
          : undefined,
      totalItems,
      totalPages,
    },
    roleState: {
      data: data.roles,
      error: errorRoles,
      isLoading: false,
    },
    stats,
    users,
  };
}
