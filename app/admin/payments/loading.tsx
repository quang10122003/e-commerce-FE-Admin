import { AdminRouteLoading } from "@/components/admin/AdminRouteLoading";

export default function PaymentsLoading() {
  return (
    <AdminRouteLoading
      description="Theo dõi payment method, trạng thái giao dịch và transaction reference."
      label="Đang tải dữ liệu payments..."
      title="Payments Management"
    />
  );
}
