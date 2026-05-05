"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Lock, ShieldCheck, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useDeleteAdminUserMutation,
  useGetAdminRolesQuery,
  useGetAdminUsersQuery,
  useUpdateAdminUserLockMutation,
  useUpdateAdminUserMutation,
} from "@/client/api/backend-api";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { UserEditPanel } from "@/components/admin/users/UserEditPanel";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { buildUsersPageQuery } from "@/components/admin/users/utils";
import { useNotification } from "@/components/ui/BrowserNotification";
import { Pagination } from "@/components/ui/Pagination";
import { getApiErrorMessage } from "@/lib/util/apiError";
import type { RoleState } from "@/types/roles";
import {
  ADMIN_USERS_PAGE_SIZE,
  type AdminUsersFilters,
  type AdminUsersQueryParams,
  type UpdateUserRequest,
  type UserItem,
  type UserListData,
  type UserStats,
} from "@/types/users";

type UsersPageClientProps = {
  // Id user đang được mở ở panel edit, lấy từ query string của trang.
  editingUserId: number | null;
  // Bộ lọc hiện tại của trang, đã được parse ở Server Component rồi truyền xuống.
  filters: AdminUsersFilters;
};

// Giá trị mặc định giúp UI render ổn định trong lúc API chưa trả dữ liệu.
const EMPTY_STATS: UserStats = {
  adminUsers: 0,
  lockedUsers: 0,
  totalUsers: 0,
};
const EMPTY_USERS: UserItem[] = [];

// Tìm user đang được edit trong danh sách hiện tại.
function findEditingUser(users: UserItem[], editingUserId: number | null) {
  if (!editingUserId) {
    return null;
  }

  return users.find((user) => user.id === editingUserId) ?? null;
}


// Chuyển filters của UI thành params để gọi API lấy danh sách users.
function toAdminUsersQueryParams(
  filters: AdminUsersFilters,
): AdminUsersQueryParams {
  return {
    page: Math.max(filters.currentPage - 1, 0),
    role: filters.roleFilter === "ALL" ? undefined : filters.roleFilter,
    search: filters.search || undefined,
    size: ADMIN_USERS_PAGE_SIZE,
    status: filters.statusFilter === "ALL" ? undefined : filters.statusFilter,
  };
}

function readUsersData(payload: { success: boolean; data: UserListData | null } | undefined) {
  // Chỉ lấy data khi backend báo success, còn lại để component dùng fallback rỗng.
  return payload?.success ? payload.data : null;
}

export function UsersPageClient({
  editingUserId,
  filters,
}: UsersPageClientProps) {
  // Router và pathname dùng để cập nhật URL khi đổi filter hoặc mở panel edit.
  const router = useRouter();
  const pathname = usePathname();
  // Helper hiển thị thông báo thành công/thất bại cho các thao tác mutation.
  const { showNotification } = useNotification();
  // Đánh dấu trạng thái pending khi replace URL filter bằng transition của React.
  const [isFilterPending, startFilterTransition] = useTransition();

  // Memo hóa query params để RTK Query không nhận object mới ở mỗi lần render.
  const usersQueryParams = useMemo(
    () => toAdminUsersQueryParams(filters),
    [filters],
  );
  // Query lấy danh sách users theo filter hiện tại.
  const usersQuery = useGetAdminUsersQuery(usersQueryParams);
  // Query lấy danh sách roles để render filter role và form edit user.
  const rolesQuery = useGetAdminRolesQuery();
  // Mutation xóa user theo id.
  const [deleteAdminUser] = useDeleteAdminUserMutation();
  // Mutation khóa/mở khóa tài khoản user.
  const [updateAdminUserLock] = useUpdateAdminUserLockMutation();
  // Mutation lưu thông tin user ở panel edit.
  const [updateAdminUser] = useUpdateAdminUserMutation();

  // Các biến dữ liệu suy ra từ response, luôn có fallback để tránh null-check ở JSX.
  const usersData = readUsersData(usersQuery.data);
  const users = usersData?.users.items ?? EMPTY_USERS;
  const stats = usersData?.stats ?? EMPTY_STATS;
  const totalItems = usersData?.users.totalItems ?? 0;
  const totalPages = Math.max(usersData?.users.totalPages ?? 1, 1);

  // Gom data, loading và error của roles thành một object đúng contract RoleState.
  const roleState: RoleState = useMemo(
    () => ({
      data: rolesQuery.data?.success ? rolesQuery.data.data : null,
      error: rolesQuery.isError
        ? getApiErrorMessage(rolesQuery.error, "Không thể tải roles.")
        : rolesQuery.data && !rolesQuery.data.success
          ? getApiErrorMessage(rolesQuery.data, "Không thể tải roles.")
          : null,
      isLoading: rolesQuery.isLoading || rolesQuery.isFetching,
    }),
    [
      rolesQuery.data,
      rolesQuery.error,
      rolesQuery.isError,
      rolesQuery.isFetching,
      rolesQuery.isLoading,
    ],
  );

  // Error của danh sách users, bao gồm lỗi request và lỗi success=false từ backend.
  const errorMessage = usersQuery.isError
    ? getApiErrorMessage(usersQuery.error, "Không thể tải danh sách user.")
    : usersQuery.data && !usersQuery.data.success
      ? getApiErrorMessage(usersQuery.data, "Không thể tải danh sách user.")
      : null;

  // searchDraft giữ text người dùng đang gõ trước khi debounce cập nhật URL.
  const [searchDraft, setSearchDraft] = useState({
    // source là search hiện tại từ URL tại thời điểm bắt đầu nhập.
    source: filters.search,
    // value là nội dung đang hiển thị trong ô input.
    value: filters.search,
  });
  // Id user đang gọi API khóa/mở khóa để disable đúng row trong bảng.
  const [submittingUserId, setSubmittingUserId] = useState<number | null>(null);
  // Id user đang bị xóa để hiển thị trạng thái loading đúng action xóa.
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  // Id user đang được lưu ở panel edit.
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  // Id user đang được chọn để edit ở phía client.
  // State này giúp nút đóng panel hoạt động sau khi F5, vì editingUserId từ props vẫn là id ban đầu.
  const [activeEditingUserId, setActiveEditingUserId] = useState<number | null>(
    editingUserId,
  );
  // Cache user đang edit để panel vẫn có dữ liệu khi URL đổi nhẹ hoặc list refetch.
  const [editingUserState, setEditingUserState] = useState<UserItem | null>(
    () => findEditingUser(users, editingUserId),
  );

  // Giá trị search hiển thị: ưu tiên draft nếu draft vẫn cùng nguồn với URL hiện tại.
  const searchInput =
    searchDraft.source === filters.search ? searchDraft.value : filters.search;
  // Giá trị search đã defer để input gõ mượt hơn trước khi effect debounce chạy.
  const deferredSearchInput = useDeferredValue(searchInput);
  // User đang edit: ưu tiên dữ liệu mới từ list, fallback về cache local nếu cần.
  const editingUser =
    findEditingUser(users, activeEditingUserId) ??
    (editingUserState?.id === activeEditingUserId ? editingUserState : null);
  // Cờ quyết định layout có hiển thị panel edit bên cạnh table hay không.
  const isEditing = editingUser !== null;
  // Id của user đang edit, dùng để biết khi nào cần đóng panel sau mutation.
  const currentEditingUserId = editingUser?.id ?? null;
  // Loading tổng hợp cho bảng và pagination.
  const isUsersLoading =
    usersQuery.isLoading || usersQuery.isFetching || isFilterPending;

  // Tạo URL mới từ filter và id user đang edit.
  const buildPageUrl = useCallback(
    (nextFilters: AdminUsersFilters, nextEditingUserId: number | null) => {
      const query = buildUsersPageQuery(nextFilters, nextEditingUserId);
      return `${pathname}${query ? `?${query}` : ""}`;
    },
    [pathname],
  );

  // Gộp filter mới với filter hiện tại rồi replace URL để trigger query mới.
  const replaceFilters = useCallback(
    (nextFilters: Partial<AdminUsersFilters>) => {
      const mergedFilters: AdminUsersFilters = {
        ...filters,
        ...nextFilters,
      };
      const nextUrl = buildPageUrl(mergedFilters, activeEditingUserId);

      startFilterTransition(() => {
        router.replace(nextUrl);
      });
    },
    [activeEditingUserId, buildPageUrl, filters, router],
  );

  // Đồng bộ id user đang edit lên URL mà không điều hướng qua router.
  const syncEditUrl = useCallback(
    (nextEditingUserId: number | null) => {
      // Chỉ đổi query edit bằng History API để đóng/mở panel mượt, không refetch list.
      window.history.replaceState(
        null,
        "",
        buildPageUrl(filters, nextEditingUserId),
      );
    },
    [buildPageUrl, filters],
  );

  useEffect(() => {
    // Chuẩn hóa search trước khi ghi lên URL để tránh query thừa khoảng trắng.
    const normalizedSearch = deferredSearchInput.trim();

    if (normalizedSearch === filters.search) {
      return;
    }

    // Debounce input tìm kiếm để không đổi URL và gọi API ở từng ký tự.
    const timeoutId = window.setTimeout(() => {
      replaceFilters({
        currentPage: 1,
        search: normalizedSearch,
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [deferredSearchInput, filters.search, replaceFilters]);

  // Mở panel edit và lưu user vào cache local để panel có dữ liệu ngay.
  const openEditUser = useCallback(
    (user: UserItem) => {
      setActiveEditingUserId(user.id);
      setEditingUserState(user);
      syncEditUrl(user.id);
    },
    [syncEditUrl],
  );

  // Đóng panel edit và xóa query edit khỏi URL.
  const closeEditUser = useCallback(() => {
    setActiveEditingUserId(null);
    setEditingUserState(null);
    syncEditUrl(null);
  }, [syncEditUrl]);

  // Cập nhật draft khi người dùng nhập search, chưa gọi API ngay.
  const updateSearchInput = useCallback(
    (value: string) => {
      setSearchDraft({
        source: filters.search,
        value,
      });
    },
    [filters.search],
  );

  // Xóa user sau khi người dùng xác nhận, rồi đóng panel nếu đang edit đúng user đó.
  const handleDeleteUser = useCallback(
    async (userId: number) => {
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa tài khoản với id: ${userId}?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingUserId(userId);

        const payload = await deleteAdminUser(userId).unwrap();

        if (!payload.success) {
          throw new Error(getApiErrorMessage(payload, "Xóa user thất bại."));
        }

        if (currentEditingUserId === userId) {
          closeEditUser();
        }

        showNotification("Đã xóa user thành công.", { tone: "success" });
      } catch (error) {
        showNotification(
          getApiErrorMessage(error, "Không thể xóa user."),
          { tone: "error" },
        );
      } finally {
        setDeletingUserId(null);
      }
    },
    [closeEditUser, currentEditingUserId, deleteAdminUser, showNotification],
  );

  // Khóa hoặc mở khóa user, đồng bộ lại panel edit nếu user đó đang được mở.
  const handleToggleLock = useCallback(
    async (user: UserItem) => {
      // nextLocked là trạng thái khóa mới sau khi toggle.
      const nextLocked = !user.locked;
      const confirmed = window.confirm(
        nextLocked
          ? `Bạn có chắc muốn khóa tài khoản ${user.email}?`
          : `Bạn có chắc muốn mở khóa tài khoản ${user.email}?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setSubmittingUserId(user.id);

        const payload = await updateAdminUserLock({
          data: { locked: nextLocked },
          userId: user.id,
        }).unwrap();

        if (!payload.success) {
          throw new Error(
            getApiErrorMessage(payload, "Cập nhật trạng thái thất bại."),
          );
        }

        // Nếu user đang edit bị đổi trạng thái và không còn khớp filter hiện tại,
        // đóng panel để tránh hiển thị bản ghi đã biến mất khỏi danh sách.
        const editedUserWasToggled = currentEditingUserId === user.id;
        const editedUserLeavesCurrentFilter =
          (filters.statusFilter === "ACTIVE" && nextLocked) ||
          (filters.statusFilter === "LOCKED" && !nextLocked);

        if (editedUserWasToggled && editedUserLeavesCurrentFilter) {
          closeEditUser();
        } else {
          setEditingUserState((currentEditingUser) =>
            currentEditingUser?.id === user.id
              ? {
                  ...currentEditingUser,
                  locked: payload.data?.locked ?? nextLocked,
                  status:
                    payload.data?.status ?? (nextLocked ? "LOCKED" : "ACTIVE"),
                }
              : currentEditingUser,
          );
        }

        showNotification(
          nextLocked
            ? `Đã khóa tài khoản ${user.email}.`
            : `Đã mở khóa tài khoản ${user.email}.`,
          { tone: nextLocked ? "warning" : "success" },
        );
      } catch (error) {
        showNotification(
          getApiErrorMessage(error, "Không thể cập nhật trạng thái user."),
          { tone: "error" },
        );
      } finally {
        setSubmittingUserId(null);
      }
    },
    [
      closeEditUser,
      currentEditingUserId,
      filters.statusFilter,
      showNotification,
      updateAdminUserLock,
    ],
  );

  // Lưu thay đổi thông tin user từ panel edit và cập nhật lại cache local của panel.
  const handleSaveUser = useCallback(
    async (userId: number, data: UpdateUserRequest) => {
      try {
        setSavingUserId(userId);

        const payload = await updateAdminUser({ data, userId }).unwrap();

        if (!payload.success || !payload.data) {
          throw new Error(getApiErrorMessage(payload, "Lưu user thất bại."));
        }

        const savedUser = payload.data;

        setEditingUserState((currentEditingUser) =>
          currentEditingUser?.id === userId
            ? {
                ...currentEditingUser,
                email: savedUser.email,
                fullName: savedUser.fullName,
                role: savedUser.role,
              }
            : currentEditingUser,
        );
        showNotification("Đã lưu thông tin user.", { tone: "success" });
      } catch (error) {
        showNotification(
          getApiErrorMessage(error, "Không thể lưu thông tin user."),
          { tone: "error" },
        );
      } finally {
        setSavingUserId(null);
      }
    },
    [showNotification, updateAdminUser],
  );

  return (
    <section>
      <PageHeader
        description="Quản lý users, role và trạng thái lock theo dữ liệu backend."
        title="Users Management"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<Users className="size-5" />}
          note="Tổng số tài khoản trong hệ thống"
          title="Tổng users"
          value={stats.totalUsers.toLocaleString("vi-VN")}
        />
        <StatCard
          icon={<ShieldCheck className="size-5" />}
          note="Tài khoản có role ADMIN"
          title="Admin accounts"
          tone="emerald"
          value={stats.adminUsers.toLocaleString("vi-VN")}
        />
        <StatCard
          icon={<Lock className="size-5" />}
          note="Tài khoản bị khóa tạm thời"
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
            onSearchChange={updateSearchInput}
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

          <UsersTable
            deletingUserId={deletingUserId}
            isLoading={isUsersLoading}
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
            isLoading={isUsersLoading}
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
          isSaving={savingUserId === editingUser?.id}
          key={editingUser?.id ?? "no-user"}
          onClose={closeEditUser}
          onSaveUser={handleSaveUser}
          roleState={roleState}
        />
      </div>
    </section>
  );
}
