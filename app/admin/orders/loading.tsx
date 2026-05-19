import { AdminRouteLoading } from "@/components/admin/AdminRouteLoading";

export default function OrdersLoading() {
  return (
    <AdminRouteLoading
      description="Theo dõi orders/order_items, trạng thái vận chuyển và thông tin giao hàng."
      label="Đang tải dữ liệu orders..."
      title="Orders Management"
    />
  );
}
