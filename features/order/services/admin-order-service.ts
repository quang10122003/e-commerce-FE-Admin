import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import {
  buildAdminOrdersBackendPath,
  buildAdminOrdersQueryParams,
} from "@/server/admin-orders";
import { serverPrivateFetch } from "@/server/backend-fetch";
import type { AdminOrdersFilters, AdminOrdersResponse } from "@/types/order";

type AdminOrdersResult = {
  data: AdminOrdersResponse | null;
  error: string | null;
};

// Gọi API lấy danh sách đơn hàng theo bộ lọc trang orders.
export async function getAdminOrders(
  filters: AdminOrdersFilters,
): Promise<AdminOrdersResult> {
  try {
    const result = await serverPrivateFetch<AdminOrdersResponse>(
      buildAdminOrdersBackendPath(buildAdminOrdersQueryParams(filters)),
    );

    return {
      data: result.data,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getApiErrorMessage(err, "Không thể tải danh sách đơn hàng."),
    };
  }
}
