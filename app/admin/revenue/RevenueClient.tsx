"use client";
import { KpiCard } from "@/components/admin/revenue/KpiCard";
import { PeriodPicker } from "@/components/admin/revenue/PeriodPicker";
import { RevenueComparisonChart } from "@/components/admin/revenue/RevenueComparisonChart";
import { RevenueTrendChart } from "@/components/admin/revenue/RevenueTrendChart";
import { getPeriodLabel, getPreviousPeriodLabel } from "@/lib/util/Date";
import { RevenueFilters, RevenuePeriodData } from "@/types/revenue";
import { usePathname, useRouter } from "next/dist/client/components/navigation";

type RevenuePanelProps = {
    filters: RevenueFilters;
    data: RevenuePeriodData | null;
    error : string | null;
};

export function RevenueClient({ filters, data, error }: RevenuePanelProps) {
    const router = useRouter();
    const pathname = usePathname();
    const periodLabel = getPeriodLabel(filters);
    const comparisonLabel = getPreviousPeriodLabel(filters);
    const emptyKpi = { value: null as number | null, deltaPct: null as number | null, trend: [] as number[] };

    function handleFilterChange(newFilters: RevenueFilters) {
        const params = new URLSearchParams();
        params.set("type", newFilters.type);
        params.set("year", String(newFilters.year));
        if (newFilters.type === "WEEK") params.set("week", String(newFilters.week));
        if (newFilters.type === "MONTH") params.set("month", String(newFilters.month));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="section-title">Thống kê doanh thu</h2>
                    <p className="text-sm text-slate-500">Đang xem: {periodLabel}</p>
                </div>
                <PeriodPicker selection={filters} onChange={handleFilterChange} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <KpiCard
                    label="Tổng doanh thu đã thanh toán"
                    value={data?.kpis.totalRevenue.value ?? emptyKpi.value}
                    deltaPct={data?.kpis.totalRevenue.deltaPct ?? emptyKpi.deltaPct}
                    accentVar="--primary"
                    icon="₫"
                />
                <KpiCard
                    label="Chờ xử lý"
                    value={data?.kpis.pending.value ?? emptyKpi.value}
                    deltaPct={data?.kpis.pending.deltaPct ?? emptyKpi.deltaPct}
                    accentVar="--ratio-pending"
                    icon="⏱"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="panel">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900">Xu hướng doanh thu</h3>
                        <span className="chip chip-primary">Đơn vị: triệu đồng</span>
                    </div>
                    <RevenueTrendChart data={data?.trendSeries ?? []} />
                </div>
                <div className="panel">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900">So sánh kỳ liền kề</h3>
                        <span className="chip chip-primary">{comparisonLabel}</span>
                    </div>
                    <RevenueComparisonChart data={data?.comparisonSeries ?? []} />
                </div>
            </div>
        </section>
    );
}