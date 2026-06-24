import type { AdminPaymentItem, AdminPaymentsResponse } from "@/types/payment";

export type AdminPaymentStats = Omit<AdminPaymentsResponse, "item">;

type AdminPaymentViewModel = {
  payments: AdminPaymentItem[] | null;
  paymentStats: AdminPaymentStats | null;
};

// Tách danh sách giao dịch và số liệu tổng quan từ response backend.
export function createAdminPaymentViewModel(
  data: AdminPaymentsResponse | null,
): AdminPaymentViewModel {
  const payments = data?.item ?? null;
  const stats = data
    ? (Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "item"),
      ) as AdminPaymentStats)
    : null;

  return {
    payments,
    paymentStats: stats,
  };
}
