"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Lock, ShieldCheck, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { UserEditPanel } from "@/components/admin/users/UserEditPanel";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { buildUsersPageQuery } from "@/components/admin/users/utils";
import { Pagination } from "@/components/ui/Pagination";
import { getAxiosErrorMessage } from "@/lib/axios/error";
import { deleteUser, updateUserLockStatus } from "@/services/users-client.service";

import type { AdminUsersFilters } from "@/services/users-server.service";
import type { roleState } from "@/types/role/role";
import type { UserItem, UserListData, UserStats } from "@/types/user/User";

type UsersPageClientProps = {
  editingUserId: number | null;
  errorMessage: string | null;
  filters: AdminUsersFilters;
  roleState: roleState;
  usersData: UserListData | null;
};

const EMPTY_STATS: UserStats = {
  totalUsers: 0,
  adminUsers: 0,
  lockedUsers: 0,
};

function findEditingUser(users: UserItem[], editingUserId: number | null) {
  if (!editingUserId) {
    return null;
  }

  return users.find((user) => user.id === editingUserId) ?? null;
}

export function UsersPageClient({
  editingUserId,
  errorMessage,
  filters,
  roleState,
  usersData,
}: UsersPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isFilterPending, startFilterTransition] = useTransition();

  const users = usersData?.users.items ?? [];
  const stats = usersData?.stats ?? EMPTY_STATS;
  const totalItems = usersData?.users.totalItems ?? 0;
  const totalPages = Math.max(usersData?.users.totalPages ?? 1, 1);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submittingUserId, setSubmittingUserId] = useState<number | null>(null);
  const [editingUserState, setEditingUserState] = useState<UserItem | null>(() =>
    findEditingUser(users, editingUserId),
  );

  const deferredSearchInput = useDeferredValue(searchInput);
  const editingUser =
    findEditingUser(users, editingUserState?.id ?? editingUserId) ?? editingUserState;
    
  const isEditing = editingUser !== null;

  const [deleteUserid, setDeletingUserId] = useState<number|null> (null)

  const buildPageUrl = useCallback(
    (nextFilters: AdminUsersFilters, nextEditingUserId: number | null) => {
      const query = buildUsersPageQuery(nextFilters, nextEditingUserId);
      return `${pathname}${query ? `?${query}` : ""}`;
    },
    [pathname],
  );

  const replaceFilters = useCallback(
    (nextFilters: Partial<AdminUsersFilters>) => {
      const mergedFilters: AdminUsersFilters = {
        ...filters,
        ...nextFilters,
      };
      const nextUrl = buildPageUrl(mergedFilters, editingUser?.id ?? null);

      startFilterTransition(() => {
        router.replace(nextUrl);
      });
    },
    [buildPageUrl, editingUser?.id, filters, router],
  );

  const syncEditUrl = useCallback(
    (nextEditingUserId: number | null) => {
      // Cap nhat query edit bang History API de panel mo dong muot, khong kich hoat refetch.
      window.history.replaceState(
        null,
        "",
        buildPageUrl(filters, nextEditingUserId),
      );
    },
    [buildPageUrl, filters],
  );

  useEffect(() => {
    const normalizedSearch = deferredSearchInput.trim();

    if (normalizedSearch === filters.search) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      replaceFilters({
        currentPage: 1,
        search: normalizedSearch,
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [deferredSearchInput, filters.search, replaceFilters]);

  const openEditUser = useCallback(
    (user: UserItem) => {
      setEditingUserState(user);
      syncEditUrl(user.id);
    },
    [syncEditUrl],
  );

// đóng form edit 
  const closeEditUser = useCallback(() => {
    setEditingUserState(null);
    syncEditUrl(null);
  }, [syncEditUrl]);

  const handleDeleteUser = useCallback(async (userId: number) => {
    const confirmed = window.confirm(
      `Ban co chac muon xoa tai khoan voi id: ${userId}?`,
    );

    if (!confirmed) {
      return;
    }
    try{
      setDeletingUserId(userId)
      setActionError(null)

      const payload = await deleteUser(userId)

      if(!payload.success){
        throw new Error(payload.message || "xoa user thất bại")
      }
      if(editingUser?.id === userId){
        closeEditUser();
      }
      router.refresh();
    }
    catch(e){
      setActionError(getAxiosErrorMessage(e,"ko thể xóa user lỗi ko xác định"))
    }
    finally{
      setDeletingUserId(null)
    }
  }, [closeEditUser,editingUser,router]);

  
  const handleToggleLock = useCallback(
    async (user: UserItem) => {
      const nextLocked = !user.locked;
      const confirmed = window.confirm(
        nextLocked
          ? `Ban co chac muon khoa tai khoan ${user.email}?`
          : `Ban co chac muon mo khoa tai khoan ${user.email}?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setSubmittingUserId(user.id);
        setActionError(null);

        const payload = await updateUserLockStatus(user.id, nextLocked);

        if (!payload.success) {
          throw new Error(payload.message || "Cap nhat trang thai that bai");
        }

        router.refresh();
      } catch (error) {
        setActionError(
          getAxiosErrorMessage(error, "Khong the cap nhat trang thai user"),
        );
      } finally {
        setSubmittingUserId(null);
      }
    },
    [router],
  );

  return (
    <section>
      <PageHeader
        description="Quan ly users, role va trang thai lock theo bang users/roles."
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
          isEditing ? "xl:grid-cols-[1.4fr_0.9fr]" : "grid-cols-1"
        }`}
      >
        <article className="panel">
          <UsersFilters
            filters={filters}
            onRoleFilterChange={(roleFilter) => {
              replaceFilters({
                currentPage: 1,
                roleFilter,
              });
            }}
            onSearchChange={setSearchInput}
            onStatusFilterChange={(statusFilter) => {
              replaceFilters({
                currentPage: 1,
                statusFilter,
              });
            }}
            roleState={roleState}
            searchInput={searchInput}
          />

          {errorMessage ? (
            <p className="mt-3 text-sm text-rose-600">{errorMessage}</p>
          ) : null}

          {actionError ? (
            <p className="mt-3 text-sm text-rose-600">{actionError}</p>
          ) : null}

          <UsersTable
            deletingUserId={deleteUserid}
            isLoading={isFilterPending}
            onDeleteUser={(userId) => {
              void handleDeleteUser(userId);
            }}
            onEditUser={openEditUser}
            onToggleLock={(user) => {
              void handleToggleLock(user);
            }}
            submittingUserId={submittingUserId}
            users={users}
          />

          <Pagination
            currentPage={filters.currentPage}
            isLoading={isFilterPending}
            itemLabel="users"
            onPageChange={(page) => {
              replaceFilters({ currentPage: page });
            }}
            totalItems={totalItems}
            totalPages={totalPages}
          />
        </article>

        <UserEditPanel
          editingUser={editingUser}
          key={editingUser?.id ?? "no-user"}
          onClose={closeEditUser}
          roleState={roleState}
        />
      </div>
    </section>
  );
}
