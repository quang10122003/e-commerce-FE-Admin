import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import {
  buildAdminPaymentBackendPath,
  buildAdminPaymentsQueryParams,
} from "@/server/admin-payment";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { rethrowNextFrameworkError } from "@/server/next-framework-error";
import type { AdminPaymentsFilters, AdminPaymentsResponse } from "@/types/payment";

type AdminPaymentsResult = {
  data: AdminPaymentsResponse | null;
  error: string | null;
};

// Gọi API lấy danh sách giao dịch theo bộ lọc trang payments.
export async function getAdminPayments(
  filters: AdminPaymentsFilters,
  refreshRedirectPath?: string,
): Promise<AdminPaymentsResult> {
  try {
    const result = await serverPrivateFetch<AdminPaymentsResponse>(
      buildAdminPaymentBackendPath(buildAdminPaymentsQueryParams(filters)),
      { refreshRedirectPath },
    );

    return {
      data: result.data,
      error: null,
    };
  } catch (err) {
    rethrowNextFrameworkError(err);

    return {
      data: null,
      error: getApiErrorMessage(err, "Không thể tải danh sách giao dịch."),
    };
  }
}
