import { CircleCheckBig, CircleX, CreditCard, Wallet } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { AdminPaymentsResponse } from "@/types/payment";

interface Props{
    dataOver: Omit<AdminPaymentsResponse,"item"> | null
}
export function PaymentStatsRow({ dataOver }: Props) {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                icon={<Wallet className="size-5" />}
                note="Tổng giao dịch phát sinh hôm nay"
                title="Transactions"
                tone="blue"
                value={dataOver?.total?.toLocaleString() ?? "—"}
            />
            <StatCard
                icon={<CircleCheckBig className="size-5" />}
                note="Thanh toán thành công"
                title="Paid"
                tone="emerald"
                value={dataOver?.paid?.toLocaleString() ?? "—"}
            />
            <StatCard
                icon={<CreditCard className="size-5" />}
                note="Giao dịch chờ xác nhận"
                title="Pending"
                tone="amber"
                value={dataOver?.pending?.toLocaleString() ?? "—"}
            />
            <StatCard
                icon={<CircleX className="size-5" />}
                note="Cần đối soát với cổng thanh toán"
                title="Failed"
                tone="violet"
                value={dataOver?.failed?.toLocaleString() ?? "—"}
            />
            <StatCard
                icon={<CircleX className="size-5" />}
                note="Thanh toán trễ hạn"
                title="Paid Late"
                tone="violet"
                value={dataOver?.paidLate?.toLocaleString() ?? "—"}
            />
        </div>
    );
}
