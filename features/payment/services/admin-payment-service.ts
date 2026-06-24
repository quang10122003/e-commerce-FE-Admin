import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import {
  buildAdminPaymentBackendPath,
  buildAdminPaymentsQueryParams,
} from "@/server/admin-payment";
import { serverPrivateFetch } from "@/server/backend-fetch";
import type { AdminPaymentsFilters, AdminPaymentsResponse } from "@/types/payment";

type AdminPaymentsResult = {
  data: AdminPaymentsResponse | null;
  error: string | null;
};

// Gọi API lấy danh sách giao dịch theo bộ lọc trang payments.
export async function getAdminPayments(
  filters: AdminPaymentsFilters,
): Promise<AdminPaymentsResult> {
  try {
    const result = await serverPrivateFetch<AdminPaymentsResponse>(
      buildAdminPaymentBackendPath(buildAdminPaymentsQueryParams(filters)),
    );

    return {
      data: result.data,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getApiErrorMessage(err, "Không thể tải danh sách giao dịch."),
    };
  }
}
