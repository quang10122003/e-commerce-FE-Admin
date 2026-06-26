
// Thẻ hiển thị một chỉ số KPI với số tiền, sparkline và badge delta.

import { formatVND, formatCompactVND } from "@/lib/util/formatCurrency";
import { DeltaBadge } from "./DeltaBadge";

export function KpiCard({
    label,
    value,
    deltaPct,
    icon,
}: {
    label: string;
    value: number | null;
    deltaPct: number | null;
    accentVar: string;
    icon: string;
}) {
    return (
        <div className="panel flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                    style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                >
                    {icon}
                </span>
            </div>
            <div className="flex items-end justify-between gap-2">
                <span
                    className="font-mono text-2xl font-semibold tracking-tight text-slate-900"
                    title={value === null ? undefined : formatVND(value)}
                >
                    {value === null ? "--" : formatCompactVND(value)}
                </span>
            </div>
            <DeltaBadge deltaPct={deltaPct} />
        </div>
    );
}