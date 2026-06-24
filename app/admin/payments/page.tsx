import { PageHeader } from "@/components/admin/PageHeader";
import { PaymentStatsRow } from "@/components/admin/payment/PaymentStatsRow";
import { PaymentStatusRatio } from "@/components/admin/payment/PaymentStatusRatio";
import { PaymentTable } from "@/components/admin/payment/PaymentTable";
import { createAdminPaymentViewModel } from "@/features/payment/mappers/admin-payment-view-model";
import { getAdminPayments } from "@/features/payment/services/admin-payment-service";
import { parseAdminPaymentsFilters } from "@/server/admin-payment";
import { NextSearchParams } from "@/types/next";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const filters = parseAdminPaymentsFilters(params);
  const { data, error } = await getAdminPayments(filters);
  const { paymentStats, payments } = createAdminPaymentViewModel(data);

  return (
    <section>
      <PageHeader
        title="Payments Management"
        description="Theo dõi phương thức thanh toán, trạng thái giao dịch và transaction reference."
      />

      <PaymentStatsRow dataOver={paymentStats} />

      <div className="mt-6 grid gap-5 grid-cols-1 xl:grid-cols-[2.5fr_1fr]">
        <PaymentTable payments={payments} error={error} filters={filters} />
        <PaymentStatusRatio dataOver={paymentStats} />
      </div>
    </section>
  );
}
