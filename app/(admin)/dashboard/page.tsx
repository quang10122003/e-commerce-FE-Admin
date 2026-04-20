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

const weekRevenue = [
  { day: "Mon", amount: 12400000 },
  { day: "Tue", amount: 9800000 },
  { day: "Wed", amount: 15700000 },
  { day: "Thu", amount: 13200000 },
  { day: "Fri", amount: 17400000 },
  { day: "Sat", amount: 20100000 },
  { day: "Sun", amount: 16600000 },
];

const latestOrders = [
  {
    id: "ORD-2301",
    customer: "Nguyen Van A",
    total: "2,540,000",
    payment: "Paid",
    status: "SHIPPING",
  },
  {
    id: "ORD-2302",
    customer: "Tran Thi B",
    total: "890,000",
    payment: "Pending",
    status: "PENDING",
  },
  {
    id: "ORD-2303",
    customer: "Le Thanh C",
    total: "5,200,000",
    payment: "Paid",
    status: "COMPLETED",
  },
];

const alerts = [
  { level: "warning", text: "7 san pham ton kho duoi 5 item" },
  { level: "danger", text: "2 giao dich VNPAY bi Failed trong 24h" },
  { level: "info", text: "12 chat room chua co admin tiep nhan" },
];

export default function DashboardPage() {
  // Chuan hoa chieu rong thanh bar theo doanh thu lon nhat trong tuan.
  const maxRevenue = Math.max(...weekRevenue.map((item) => item.amount));

  return (
    <section>
      <PageHeader
        description="Tong quan tinh hinh kinh doanh va van hanh he thong ecommerce."
        title="Tong quan he thong"
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={<Users className="size-5" />}
          note="+18 users moi trong 7 ngay"
          title="Tong users"
          tone="blue"
          value="1,284"
        />
        <StatCard
          icon={<Box className="size-5" />}
          note="143 san pham dang active"
          title="Tong products"
          tone="violet"
          value="168"
        />
        <StatCard
          icon={<ShoppingCart className="size-5" />}
          note="39 don dang giao"
          title="Don hang hom nay"
          tone="amber"
          value="74"
        />
        <StatCard
          icon={<CircleDollarSign className="size-5" />}
          note="+12.4% so voi tuan truoc"
          title="Doanh thu tuan"
          tone="emerald"
          value="104.6M"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Doanh thu 7 ngay</h2>
          <div className="mt-4 space-y-3">
            {weekRevenue.map((item) => (
              <div className="grid grid-cols-[42px_1fr_auto] items-center gap-3" key={item.day}>
                <p className="text-sm font-medium text-slate-600">{item.day}</p>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-linear-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${Math.round((item.amount / maxRevenue) * 100)}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {(item.amount / 1000000).toFixed(1)}M
                </p>
              </div>
            ))}
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
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 font-medium">Order ID</th>
                <th className="py-3 font-medium">Khach hang</th>
                <th className="py-3 font-medium">Tong tien</th>
                <th className="py-3 font-medium">Payment</th>
                <th className="py-3 font-medium">Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr className="border-b border-slate-100" key={order.id}>
                  <td className="py-3 font-semibold text-slate-800">{order.id}</td>
                  <td className="py-3">{order.customer}</td>
                  <td className="py-3">{order.total} VND</td>
                  <td className="py-3">
                    <StatusBadge tone={order.payment === "Paid" ? "success" : "warning"}>
                      {order.payment}
                    </StatusBadge>
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      tone={
                        order.status === "COMPLETED"
                          ? "success"
                          : order.status === "PENDING"
                            ? "warning"
                            : "info"
                      }
                    >
                      {order.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
