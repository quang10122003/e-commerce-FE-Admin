import { PageHeader } from "@/components/admin/PageHeader";
import { PaymentStatsRow } from "@/components/admin/payment/PaymentStatsRow";
import { PaymentStatusRatio } from "@/components/admin/payment/PaymentStatusRatio";
import { PaymentTable } from "@/components/admin/payment/PaymentTable";
import { getApiErrorMessage } from "@/lib/util/apiError";
import {
  buildAdminPaymentBackendPath,
  buildAdminPaymentsQueryParams,
  parseAdminPaymentsFilters,
} from "@/server/admin-payment";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { NextSearchParams } from "@/types/next";
import { AdminPaymentItem, AdminPaymentsFilters, AdminPaymentsResponse } from "@/types/payment";

// ─── Fetch dữ liệu từ backend ─────────────────────────────────────────────────

/**
 * Gọi API lấy danh sách giao dịch theo filter.
 * serverPrivateFetch đã unwrap ApiResponse — trả thẳng data array.
 */
async function getAdminPayments(filters: AdminPaymentsFilters): Promise<{
  data: AdminPaymentsResponse | null;
  error: string | null;
}> {
  try {
    const result = await serverPrivateFetch<AdminPaymentsResponse>(
      buildAdminPaymentBackendPath(buildAdminPaymentsQueryParams(filters)),
    );
    return {
      data: result.data,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getApiErrorMessage(err, "Không thể tải danh sách giao dịch."),
    };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const filter = parseAdminPaymentsFilters(params);
  const { data, error } = await getAdminPayments(filter);

  // Tách item và stats từ response
  const payments = data?.item ?? null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item , ...stats } = data ?? {};
  const paymentStats = data ? (stats as Omit<AdminPaymentsResponse, "item">) : null;

  return (
    <section>
      <PageHeader
        title="Payments Management"
        description="Theo dõi phương thức thanh toán, trạng thái giao dịch và transaction reference."
      />

      <PaymentStatsRow dataOver={paymentStats}/>

      <div className="mt-6 grid gap-5 grid-cols-1 xl:grid-cols-[2.5fr_1fr]">
        <PaymentTable payments={payments} error={error} />
        <PaymentStatusRatio dataOver={paymentStats} />
      </div>
    </section>
  );
}