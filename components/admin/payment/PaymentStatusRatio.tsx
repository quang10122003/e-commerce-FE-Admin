import { buildRatioItems, calcTotal } from "@/lib/admin/payment-ratio";
import { AdminPaymentsResponse } from "@/types/payment";

interface Props {
    dataOver: Omit<AdminPaymentsResponse, "item"> | null;
}

export function PaymentStatusRatio({ dataOver }: Props) {
    const items = buildRatioItems(dataOver);
    const total = calcTotal(items);

    return (
        <article className="panel h-fit">
            <h2 className="section-title">Tỉ lệ thanh toán</h2>

            {/* Stacked bar */}
            <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                {items.map((s) => (
                    <div
                        key={s.key}
                        className="transition-all duration-500"
                        style={{
                            width: `${total > 0 ? (s.amount / total) * 100 : 0}%`,
                            background: s.bar,
                        }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-3.5">
                {items.map((s) => (
                    <div
                        key={s.key}
                        className="flex items-center justify-between gap-1 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.dot}`} />
                            <span className="font-medium text-slate-700">{s.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">
                                {dataOver ? `${s.amount} GD` : "—"}
                            </span>
                            <span className={`w-12 text-right font-bold tabular-nums ${s.text}`}>
                                {dataOver ? `${s.percentage}%` : "—"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="text-slate-500 font-medium">Tổng</span>
                <span className="text-base font-bold text-slate-800">
                    {dataOver ? total : "—"}
                </span>
            </div>
        </article>
    );
}