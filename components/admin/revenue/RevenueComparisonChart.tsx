
// Biểu đồ cột so sánh kỳ hiện tại với kỳ liền trước.

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useCssVars } from "@/features/revenue/hook/useCssVars";
import { formatCompactVND } from "@/lib/util/formatCurrency";
interface porps {
    data: { label: string; current: number; previous: number }[] | undefined,
    error: string | null
}
function NoData() {
    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            Chưa có dữ liệu
        </div>
    );
}

function ErrorMessage({ error }: { error: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center text-error">
            {error}
        </div>
    );
}

export function RevenueComparisonChart({ data, error }: porps) {
    const vars = useCssVars(["--primary", "--panel-border", "--foreground"]);
    const primary = vars["--primary"] || "#0f4ad9";
    const border = vars["--panel-border"] || "#dbe4f0";
    const muted = vars["--foreground"] || "#0f172a";
    const previousColor = "#94a3b8";
    const isEmpty = !data || data.length === 0;




    return (
        <div>
            <div className="relative h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 8, left: 13, bottom: 10 }} barGap={4}>
                        <CartesianGrid vertical={false} stroke={border} />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: muted, fillOpacity: 0.55 }}
                            tickMargin={20}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: muted, fillOpacity: 0.55 }}
                            tickFormatter={(value) => typeof value === "number" ? formatCompactVND(value) : value}
                            width={48}
                        />
                        <Tooltip
                            formatter={(value, name) => typeof value === "number" ? [formatCompactVND(value), name === "current" ? "Kỳ này" : "Kỳ trước"] :
                                [value, name === "current" ? "Kỳ này" : "Kỳ trước"]}
                            contentStyle={{
                                borderRadius: 12,
                                border: `1px solid ${border}`,
                                fontSize: 13,
                            }}
                        />
                        <Bar dataKey="previous" name="previous" fill={previousColor} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="current" name="current" fill={primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                {error && <ErrorMessage error={error} />}

                {isEmpty && !error && <NoData />}
            </div>
            <div className="mt-2 flex items-center justify-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: primary }} />
                    <span className="text-slate-600">Kỳ này</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: previousColor }} />
                    <span className="text-slate-600">Kỳ trước</span>
                </span>
            </div>
        </div>
    );
}