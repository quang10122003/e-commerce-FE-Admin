import { Lock, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { UserEditPanel } from "@/components/admin/users/UserEditPanel";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Pagination } from "@/components/ui/Pagination";
import type { Role, RoleState } from "@/types/roles";
import type {
  AdminUsersFilters,
  UserItem,
  UserListData,
  UserStats,
} from "@/types/users";

type UsersPageClientProps = {
  data: {
    roles: Role[] | null;
    users: UserListData | null;
  };
  editingUserId: number | null;
  error: {
    errorRoles: string | null;
    errorUsers: string | null;
  };
  filters: AdminUsersFilters;
};

type BuildUsersPageHrefOptions = {
  editingUserId?: number | null;
  filters: AdminUsersFilters;
  page?: number;
};

const EMPTY_STATS: UserStats = {
  adminUsers: 0,
  lockedUsers: 0,
  totalUsers: 0,
};
const EMPTY_USERS: UserItem[] = [];

function findEditingUser(users: UserItem[], editingUserId: number | null) {
  if (!editingUserId) {
    return null;
  }

  return users.find((user) => user.id === editingUserId) ?? null;
}

function buildUsersPageHref({
  editingUserId = null,
  filters,
  page = filters.currentPage,
}: BuildUsersPageHrefOptions) {
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

export function UsersPageClient({
  data,
  editingUserId,
  error,
  filters,
}: UsersPageClientProps) {
  const usersPage = data.users?.users;
  const users = usersPage?.items ?? EMPTY_USERS;
  const stats = data.users?.stats ?? EMPTY_STATS;
  const totalItems = usersPage?.totalItems ?? 0;
  const totalPages = Math.max(usersPage?.totalPages ?? 1, 1);
  const currentPage = Math.min(Math.max(filters.currentPage, 1), totalPages);
  const editingUser = findEditingUser(users, editingUserId);
  const activeUserId = editingUser?.id ?? null;

  const roleState: RoleState = {
    data: data.roles,
    error: error.errorRoles,
    isLoading: false,
  };

  const closeEditHref = buildUsersPageHref({
    filters,
    page: currentPage,
  });
  const previousHref =
    currentPage > 1
      ? buildUsersPageHref({
          filters,
          page: currentPage - 1,
        })
      : undefined;
  const nextHref =
    currentPage < totalPages
      ? buildUsersPageHref({
          filters,
          page: currentPage + 1,
        })
      : undefined;

  return (
    <section>
      <PageHeader
        description="Quan ly users, role va trang thai lock theo du lieu backend."
        title="Users Management"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<Users className="size-5" />}
          note="Tong so tai khoan trong he thong"
          title="Tong users"
          value={stats.totalUsers.toLocaleString("vi-VN")}
        />
        <StatCard
          icon={<ShieldCheck className="size-5" />}
          note="Tai khoan co role ADMIN"
          title="Admin accounts"
          tone="emerald"
          value={stats.adminUsers.toLocaleString("vi-VN")}
        />
        <StatCard
          icon={<Lock className="size-5" />}
          note="Tai khoan bi khoa tam thoi"
          title="Locked users"
          tone="amber"
          value={stats.lockedUsers.toLocaleString("vi-VN")}
        />
      </div>

      <div
        className={`mt-6 grid items-start gap-5 ${
          editingUser ? "xl:grid-cols-[1.4fr_0.9fr]" : "grid-cols-1"
        }`}
      >
        <article className="panel">
          <UsersFilters filters={filters} roleState={roleState} />

          {error.errorUsers ? (
            <p className="mt-3 text-sm text-error">{error.errorUsers}</p>
          ) : null}
          {error.errorRoles ? (
            <p className="mt-3 text-sm text-error">{error.errorRoles}</p>
          ) : null}

          <UsersTable
            activeUserId={activeUserId}
            closeEditHref={closeEditHref}
            getEditHref={(userId) =>
              buildUsersPageHref({
                editingUserId: userId,
                filters,
                page: currentPage,
              })
            }
            statusFilter={filters.statusFilter}
            users={users}
          />

          <Pagination
            currentPage={currentPage}
            itemLabel="users"
            nextHref={nextHref}
            previousHref={previousHref}
            totalItems={totalItems}
            totalPages={totalPages}
          />
        </article>

        <UserEditPanel
          closeHref={closeEditHref}
          editingUser={editingUser}
          key={editingUser?.id ?? "no-user"}
          roleState={roleState}
        />
      </div>
    </section>
  );
}
