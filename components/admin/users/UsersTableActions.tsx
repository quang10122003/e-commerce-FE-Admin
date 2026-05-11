"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useDeleteAdminUserMutation,
  useUpdateAdminUserLockMutation,
} from "@/client/api/backend-api";
import { useNotification } from "@/components/ui/BrowserNotification";
import { getApiErrorMessage } from "@/lib/util/apiError";
import type { UserItem } from "@/types/users";

type UsersTableActionsProps = {
  activeUserId: number | null;
  closeEditHref: string;
  editHref: string;
  statusFilter: string;
  user: UserItem;
};

export function UsersTableActions({
  activeUserId,
  closeEditHref,
  editHref,
  statusFilter,
  user,
}: UsersTableActionsProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isRoutePending, startRouteTransition] = useTransition();
  const [deleteAdminUser, deleteState] = useDeleteAdminUserMutation();
  const [updateAdminUserLock, lockState] = useUpdateAdminUserLockMutation();

  const isActiveUser = activeUserId === user.id;
  const isDeleting = deleteState.isLoading;
  const isTogglingLock = lockState.isLoading;

  function refreshRoute() {
    startRouteTransition(() => {
      router.refresh();
    });
  }

  function replaceRoute(href: string) {
    startRouteTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  async function handleDeleteUser() {
    const confirmed = window.confirm(
      `Ban co chac muon xoa tai khoan voi id: ${user.id}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const payload = await deleteAdminUser(user.id).unwrap();

      if (!payload.success) {
        throw new Error(getApiErrorMessage(payload, "Xoa user that bai."));
      }

      showNotification("Da xoa user thanh cong.", { tone: "success" });

      if (isActiveUser) {
        replaceRoute(closeEditHref);
      } else {
        refreshRoute();
      }
    } catch (error) {
      showNotification(getApiErrorMessage(error, "Khong the xoa user."), {
        tone: "error",
      });
    }
  }

  async function handleToggleLock() {
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
      const payload = await updateAdminUserLock({
        data: { locked: nextLocked },
        userId: user.id,
      }).unwrap();

      if (!payload.success) {
        throw new Error(
          getApiErrorMessage(payload, "Cap nhat trang thai that bai."),
        );
      }

      const activeUserLeavesCurrentFilter =
        isActiveUser &&
        ((statusFilter === "ACTIVE" && nextLocked) ||
          (statusFilter === "LOCKED" && !nextLocked));

      showNotification(
        nextLocked
          ? `Da khoa tai khoan ${user.email}.`
          : `Da mo khoa tai khoan ${user.email}.`,
        { tone: nextLocked ? "warning" : "success" },
      );

      if (activeUserLeavesCurrentFilter) {
        replaceRoute(closeEditHref);
      } else {
        refreshRoute();
      }
    } catch (error) {
      showNotification(
        getApiErrorMessage(error, "Khong the cap nhat trang thai user."),
        { tone: "error" },
      );
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className={`btn-outline ${
          isActiveUser ? "border-blue-200 bg-blue-50 text-blue-700" : ""
        }`}
        href={editHref}
        scroll={false}
      >
        {isActiveUser ? "Dang edit" : "Edit"}
      </Link>

      <button
        className="btn-outline"
        disabled={isTogglingLock || isRoutePending}
        onClick={() => {
          void handleToggleLock();
        }}
        type="button"
      >
        {isTogglingLock ? "Dang xu ly..." : user.locked ? "Unlock" : "Lock"}
      </button>

      <button
        className="btn-outline-danger"
        disabled={isDeleting || isRoutePending}
        onClick={() => {
          void handleDeleteUser();
        }}
        type="button"
      >
        {isDeleting ? "Dang xoa..." : "Xoa"}
      </button>
    </div>
  );
}
