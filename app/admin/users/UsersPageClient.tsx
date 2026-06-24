import { Lock, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { UserEditPanel } from "@/components/admin/users/UserEditPanel";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Pagination } from "@/components/ui/Pagination";
import { createAdminUsersViewModel } from "@/features/user/mappers/admin-user-view-model";
import type {
  AdminUsersInitialData,
  AdminUsersInitialError,
} from "@/features/user/services/admin-user-service";
import { buildUsersPageHref } from "@/lib/admin/users-url";
import type { AdminUsersFilters } from "@/types/users";

type UsersPageClientProps = {
  data: AdminUsersInitialData;
  editingUserId: number | null;
  error: AdminUsersInitialError;
  filters: AdminUsersFilters;
};

export function UsersPageClient({
  data,
  editingUserId,
  error,
  filters,
}: UsersPageClientProps) {
  const {
    activeUserId,
    closeEditHref,
    editingUser,
    pagination,
    roleState,
    stats,
    users,
  } = createAdminUsersViewModel({
    data,
    editingUserId,
    errorRoles: error.errorRoles,
    filters,
  });

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

          <UsersTable
            activeUserId={activeUserId}
            closeEditHref={closeEditHref}
            getEditHref={(userId) =>
              buildUsersPageHref({
                editingUserId: userId,
                filters,
                page: pagination.currentPage,
              })
            }
            statusFilter={filters.statusFilter}
            users={users}
          />

          <Pagination
            currentPage={pagination.currentPage}
            itemLabel="users"
            nextHref={pagination.nextHref}
            previousHref={pagination.previousHref}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
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
