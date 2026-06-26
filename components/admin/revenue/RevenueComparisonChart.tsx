
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

export function RevenueComparisonChart({
    data,
}: {
    data: { label: string; current: number; previous: number }[];
}) {
    const vars = useCssVars(["--primary", "--panel-border", "--foreground"]);
    const primary = vars["--primary"] || "#0f4ad9";
    const border = vars["--panel-border"] || "#dbe4f0";
    const muted = vars["--foreground"] || "#0f172a";
    const previousColor = "#94a3b8";

    return (
        <div>
            <div className="relative h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }} barGap={4}>
                        <CartesianGrid vertical={false} stroke={border} />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: muted, fillOpacity: 0.55 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: muted, fillOpacity: 0.55 }}
                            tickFormatter={(v) => `${v}tr`}
                            width={48}
                        />
                        <Tooltip
                            formatter={(value, name) => [`${value} triệu đ`, name === "current" ? "Kỳ này" : "Kỳ trước"]}
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
                {data.length === 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                        Chưa có dữ liệu
                    </div>
                )}
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