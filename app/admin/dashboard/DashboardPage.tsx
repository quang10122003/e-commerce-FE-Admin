import {
  AlertTriangle,
  Box,
  CircleDollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Loading } from "@/components/ui/Loading";
import { createAdminDashboardViewModel } from "@/features/dashboard/mappers/admin-dashboard-view-model";
import { formatCompactCurrency, formatCurrency } from "@/lib/util/formatCurrency";
import { formatLocalDate, formatLocalDateTime } from "@/lib/util/Date";
import type { AdminOverviewResponse } from "@/types/overview";

type DashboardPageProps = {
  data: AdminOverviewResponse | null;
  error: string | null;
};

const alerts = [
  { level: "warning", text: "7 san pham ton kho duoi 5 item" },
  { level: "danger", text: "2 giao dich VNPAY bi Failed trong 24h" },
  { level: "info", text: "12 chat room chua co admin tiep nhan" },
];

export default function DashboardPage({ data, error }: DashboardPageProps) {
  if (error) {
    return (
      <div className="panel flex min-h-80 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-error">{error}</p>
        <p className="text-sm text-slate-500">Vui long thu lai sau.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel flex min-h-80 flex-col items-center justify-center gap-3 text-blue-600">
        <Loading size="lg" label="Dang tai dashboard" />
        <p className="text-sm font-medium text-slate-600">Dang tai dashboard...</p>
      </div>
    );
  }

  const {
    latestOrders,
    orderOverview,
    productOverview,
    revenueBars,
    revenueOverview,
    userOverview,
  } = createAdminDashboardViewModel(data);

  return (
    <section>
      <PageHeader
        description="Tong quan tinh hinh kinh doanh va van hanh he thong ecommerce."
        title="Tong quan he thong"
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={<Users className="size-5" />}
          note={`${userOverview.newUserIn7day} User mới trong 7 ngày qua`}
          title="Tong users"
          tone="blue"
          value={`${userOverview.totalUser}`}
        />
        <StatCard
          icon={<Box className="size-5" />}
          note={`${productOverview.productActive} sản phẩm đc active`}
          title="Tong products"
          tone="violet"
          value={`${productOverview.totalProducts}`}
        />
        <StatCard
          icon={<ShoppingCart className="size-5" />}
          note={`${orderOverview.pendingOrderCount} đơn hàng đang trong trạng thái chờ`}
          title="Don hang hom nay"
          tone="amber"
          value={`${orderOverview.todayOrderCount}`}
        />
        <StatCard
          icon={<CircleDollarSign className="size-5" />}
          note={`${revenueOverview.weeklyRevenueGrowthRate > 0 ? "+" : ""}${
            revenueOverview.weeklyRevenueGrowthRate
          }% so với tuần trc`}
          title="Doanh thu tuan"
          tone="emerald"
          value={`${formatCompactCurrency(revenueOverview.weeklyRevenue)}`}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className="panel">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Doanh thu 7 ngay</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {formatCurrency(revenueOverview.weeklyRevenue)}
              </h2>
            </div>
            <span className="w-fit rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              {revenueOverview.weeklyRevenueGrowthRate > 0 ? "+" : ""}
              {revenueOverview.weeklyRevenueGrowthRate}% so voi tuan truoc
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {revenueBars.length ? (
              revenueBars.map((item) => (
                <div
                  className="grid grid-cols-[118px_1fr_auto] items-center gap-3"
                  key={item.createdAt}
                >
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-medium text-slate-600">{item.dayLabel}</p>
                    <p className="text-xs font-medium text-slate-400">
                      {formatLocalDate(item.createdAt)}
                    </p>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-linear-to-r from-blue-500 to-indigo-500"
                      style={{
                        width: `${item.widthPercent}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatCompactCurrency(item.revenueInDay)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-md bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                Chua co du lieu doanh thu trong 7 ngay.
              </p>
            )}
          </div>
        </article>

        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Canh bao he thong</h2>
          <div className="mt-4 space-y-3">
            {alerts.map((item) => (
              <div
                className="panel-muted flex items-start gap-3 border-slate-200 bg-white"
                key={item.text}
              >
                <AlertTriangle className="mt-0.5 size-4 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <div className="mt-2">
                    {item.level === "danger" ? (
                      <StatusBadge tone="danger">Can xu ly ngay</StatusBadge>
                    ) : item.level === "warning" ? (
                      <StatusBadge tone="warning">Can theo doi</StatusBadge>
                    ) : (
                      <StatusBadge tone="info">Thong tin</StatusBadge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel mt-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Don hang moi nhat</h2>
          <span className="chip chip-primary">Realtime preview</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 font-medium">Order ID</th>
                <th className="py-3 font-medium">Thoi gian</th>
                <th className="py-3 font-medium">Khach hang</th>
                <th className="py-3 font-medium">Tong tien</th>
                <th className="py-3 font-medium">Payment</th>
                <th className="py-3 font-medium">Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.length ? (
                latestOrders.map((order) => (
                  <tr className="border-b border-slate-100" key={order.id}>
                    <td className="py-3 font-semibold text-slate-800">{order.id}</td>
                    <td className="py-3 text-slate-600">
                      {formatLocalDateTime(order.createdAt)}
                    </td>
                    <td className="py-3">{order.shippingName}</td>
                    <td className="py-3">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3">
                      <StatusBadge tone="success">{order.methodPayment}</StatusBadge>
                    </td>
                    <td className="py-3">
                      <StatusBadge
                        tone={
                          order.statusOrder === "COMPLETED"
                            ? "success"
                            : order.statusOrder === "PENDING"
                              ? "warning"
                              : "info"
                        }
                      >
                        {order.statusOrder}
                      </StatusBadge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 text-sm font-medium text-slate-500" colSpan={6}>
                    Chua co don hang moi nhat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
