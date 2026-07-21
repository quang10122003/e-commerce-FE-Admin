import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { rethrowNextFrameworkError } from "@/server/next-framework-error";
import type { AdminOverviewResponse } from "@/types/overview";

const ADMIN_OVERVIEW_URL = "/admin/overview";

type AdminOverviewResult = {
  data: AdminOverviewResponse | null;
  error: string | null;
};

// Gọi API lấy dữ liệu tổng quan cho dashboard admin.
export async function getAdminOverview(
  refreshRedirectPath?: string,
): Promise<AdminOverviewResult> {
  try {
    const payload =
      await serverPrivateFetch<AdminOverviewResponse>(ADMIN_OVERVIEW_URL, {
        refreshRedirectPath,
      });

    if (!payload.success) {
      return {
        data: null,
        error: getApiErrorMessage(payload, "Khong the tai du lieu tong quan."),
      };
    }

    return {
      data: payload.data,
      error: null,
    };
  } catch (error) {
    rethrowNextFrameworkError(error);

    return {
      data: null,
      error: getApiErrorMessage(error, "Khong the tai du lieu tong quan."),
    };
  }
}
