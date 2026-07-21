import { ClipboardList, MapPin, Truck } from "lucide-react";
import { OrdersPanel } from "@/components/admin/order/OrdersPanel";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { getAdminOrders } from "@/features/order/services/admin-order-service";
import { parseAdminOrdersFilters } from "@/server/admin-orders";
import { buildPathWithSearchParams } from "@/server/auth-refresh-redirect";
import { NextSearchParams } from "@/types/next";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const refreshRedirectPath = buildPathWithSearchParams("/admin/orders", params);

  const filters = parseAdminOrdersFilters(params);
  const { data, error } = await getAdminOrders(filters, refreshRedirectPath);
  const orders = data?.item ?? null;

  return (
    <section>
      <PageHeader
        description="Theo dõi orders/order_items, trạng thái vận chuyển và thông tin giao hàng."
        title="Orders Management"
      />

      {/* Khu vực thống kê tổng quan đơn hàng */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<ClipboardList className="size-5" />}
          note="Tổng đơn mới trong ngày"
          title="Đơn hôm nay"
          value={data?.today?.toLocaleString("vi-VN") ?? "—"}
        />
        <StatCard
          icon={<Truck className="size-5" />}
          note="Đơn đang chờ xử lý"
          title="PENDING"
          tone="amber"
          value={data?.pending?.toLocaleString("vi-VN") ?? "—"}
        />
        <StatCard
          icon={<MapPin className="size-5" />}
          note="Tỉ lệ giao thành công 7 ngày"
          title="Delivery success"
          tone="emerald"
          value={data ? `${data.deliverySuccessRate}%` : "—"}
        />
      </div>

      <OrdersPanel error={error} filters={filters} orders={orders} />
    </section>
  );
}
