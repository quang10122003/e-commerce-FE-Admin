import { ClipboardList, MapPin, Truck } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

const orders = [
  {
    id: "ORD-3001",
    userId: 2,
    status: "PENDING",
    shippingName: "Nguyen Van An",
    shippingPhone: "0901234567",
    shippingAddress: "12 Nguyen Trai, Q1, HCM",
    totalAmount: "2,540,000",
    createdAt: "2026-04-18 09:34",
    items: [
      { name: "iPhone 16 Pro 256GB", category: "Dien thoai", quantity: 1, price: "31,990,000" },
      { name: "Op lung Carbon", category: "Phu kien", quantity: 1, price: "550,000" },
    ],
  },
  {
    id: "ORD-3002",
    userId: 4,
    status: "SHIPPING",
    shippingName: "Pham Van Cuong",
    shippingPhone: "0911223344",
    shippingAddress: "88 Le Loi, Da Nang",
    totalAmount: "5,180,000",
    createdAt: "2026-04-18 12:21",
    items: [
      { name: "May loc khong khi AirHome", category: "Gia dung", quantity: 1, price: "3,290,000" },
      { name: "Bo loc du phong", category: "Gia dung", quantity: 2, price: "945,000" },
    ],
  },
  {
    id: "ORD-3003",
    userId: null,
    status: "COMPLETED",
    shippingName: "Guest Checkout",
    shippingPhone: "0987766554",
    shippingAddress: "21 Tran Hung Dao, Ha Noi",
    totalAmount: "890,000",
    createdAt: "2026-04-17 14:02",
    items: [{ name: "Tai nghe Bluetooth MaxSound", category: "Phu kien", quantity: 1, price: "890,000" }],
  },
];

export default function OrdersPage() {
  return (
    <section>
      <PageHeader
        description="Theo doi orders/order_items, trang thai van chuyen va thong tin giao hang."
        title="Orders Management"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<ClipboardList className="size-5" />}
          note="Tong don moi trong ngay"
          title="Don hom nay"
          value="74"
        />
        <StatCard
          icon={<Truck className="size-5" />}
          note="Don dang giao boi doi van chuyen"
          title="Dang shipping"
          tone="amber"
          value="39"
        />
        <StatCard
          icon={<MapPin className="size-5" />}
          note="Ti le giao thanh cong 7 ngay"
          title="Delivery success"
          tone="emerald"
          value="96.2%"
        />
      </div>

      <article className="panel mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400"
            placeholder="Tim theo order id / so dien thoai..."
            type="text"
          />
          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
            <option>Tat ca status</option>
            <option>PENDING</option>
            <option>SHIPPING</option>
            <option>COMPLETED</option>
            <option>CANCELLED</option>
          </select>
        </div>

        <div className="mt-5 space-y-4">
          {orders.map((order) => (
            <div className="rounded-2xl border border-slate-200 bg-white p-4" key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="text-lg font-bold text-slate-900">{order.id}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p>Created: {order.createdAt}</p>
                  <p>User ID: {order.userId ?? "Guest"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    tone={
                      order.status === "COMPLETED"
                        ? "success"
                        : order.status === "PENDING"
                          ? "warning"
                          : order.status === "CANCELLED"
                            ? "danger"
                            : "info"
                    }
                  >
                    {order.status}
                  </StatusBadge>
                  <span className="chip chip-primary">{order.totalAmount} VND</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1.2fr_1fr] gap-4">
                <div className="panel-muted border-slate-200 bg-white">
                  <p className="text-sm font-semibold text-slate-800">Order items</p>
                  <div className="mt-3 space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        key={`${order.id}-${index + 1}`}
                      >
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">x{item.quantity}</p>
                          <p className="text-xs text-slate-500">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel-muted border-slate-200 bg-white">
                  <p className="text-sm font-semibold text-slate-800">Shipping info</p>
                  <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                    <p>
                      <span className="font-medium">Nguoi nhan:</span> {order.shippingName}
                    </p>
                    <p>
                      <span className="font-medium">Dien thoai:</span> {order.shippingPhone}
                    </p>
                    <p>
                      <span className="font-medium">Dia chi:</span> {order.shippingAddress}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                      type="button"
                    >
                      Cap nhat status
                    </button>
                    <button
                      className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700"
                      type="button"
                    >
                      Huy don
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
