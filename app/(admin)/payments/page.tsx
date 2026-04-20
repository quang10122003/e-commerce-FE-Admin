import { CircleCheckBig, CircleX, CreditCard, Wallet } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

const payments = [
  {
    id: 801,
    orderId: "ORD-3001",
    method: "STRIPE",
    status: "Paid",
    transactionRef: "pi_3Qx82fY9",
    paidAt: "2026-04-18 09:36",
  },
  {
    id: 802,
    orderId: "ORD-3002",
    method: "VNPAY",
    status: "Pending",
    transactionRef: "VNPAY_982734",
    paidAt: "--",
  },
  {
    id: 803,
    orderId: "ORD-3003",
    method: "COD",
    status: "Pending",
    transactionRef: "COD-ORD-3003",
    paidAt: "--",
  },
  {
    id: 804,
    orderId: "ORD-2999",
    method: "VNPAY",
    status: "Failed",
    transactionRef: "VNPAY_982011",
    paidAt: "--",
  },
];

const methodVolume = [
  { method: "COD", amount: 35 },
  { method: "STRIPE", amount: 42 },
  { method: "VNPAY", amount: 23 },
];

export default function PaymentsPage() {
  // Lay moc lon nhat de convert ti le % thanh chieu rong progress bar.
  const max = Math.max(...methodVolume.map((item) => item.amount));

  return (
    <section>
      <PageHeader
        description="Theo doi payment method, trang thai giao dich va transaction reference."
        title="Payments Management"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Wallet className="size-5" />}
          note="Tong giao dich phat sinh hom nay"
          title="Transactions"
          tone="blue"
          value="126"
        />
        <StatCard
          icon={<CircleCheckBig className="size-5" />}
          note="Thanh toan thanh cong"
          title="Paid"
          tone="emerald"
          value="84"
        />
        <StatCard
          icon={<CreditCard className="size-5" />}
          note="Giao dich cho xac nhan"
          title="Pending"
          tone="amber"
          value="33"
        />
        <StatCard
          icon={<CircleX className="size-5" />}
          note="Can doi soat voi cong thanh toan"
          title="Failed"
          tone="violet"
          value="9"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Danh sach giao dich</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 font-medium">Payment ID</th>
                  <th className="py-3 font-medium">Order ID</th>
                  <th className="py-3 font-medium">Method</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Transaction ref</th>
                  <th className="py-3 font-medium">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr className="border-b border-slate-100" key={payment.id}>
                    <td className="py-3 font-semibold text-slate-800">#{payment.id}</td>
                    <td className="py-3">{payment.orderId}</td>
                    <td className="py-3">
                      <StatusBadge tone="info">{payment.method}</StatusBadge>
                    </td>
                    <td className="py-3">
                      <StatusBadge
                        tone={
                          payment.status === "Paid"
                            ? "success"
                            : payment.status === "Failed"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {payment.status}
                      </StatusBadge>
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-600">
                      {payment.transactionRef}
                    </td>
                    <td className="py-3">{payment.paidAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="space-y-5">
          <div className="panel">
            <h2 className="text-lg font-semibold text-slate-900">Ty trong theo method</h2>
            <div className="mt-4 space-y-3">
              {methodVolume.map((item) => (
                <div className="space-y-1" key={item.method}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.method}</span>
                    <span className="text-slate-500">{item.amount}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${Math.round((item.amount / max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h2 className="text-lg font-semibold text-slate-900">Bo loc nhanh</h2>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option>All methods</option>
                <option>COD</option>
                <option>STRIPE</option>
                <option>VNPAY</option>
              </select>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option>All status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <button
                className="w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                type="button"
              >
                Apply filter
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
