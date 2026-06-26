import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useCssVars } from "@/features/revenue/hook/useCssVars";
import { formatCompactVND } from "@/lib/util/formatCurrency";

interface Props {
    data: { label: string; revenue: number }[] | undefined;
    error: string | null;
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

export function RevenueTrendChart({ data, error }: Props) {
    const vars = useCssVars(["--primary", "--panel-border", "--foreground"]);
    const primary = vars["--primary"] || "#0f4ad9";
    const border = vars["--panel-border"] || "#dbe4f0";
    const muted = vars["--foreground"] || "#0f172a";

    const isEmpty = !data || data.length === 0;

    return (
        <div className="relative h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 8, left: 13, bottom: 10}}>
                    <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={primary} stopOpacity={0.22} />
                            <stop offset="100%" stopColor={primary} stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} stroke={border} />

                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: muted, fillOpacity: 0.55 }}
                        padding={{ left: 16, right: 16 }}
                        tickMargin={20}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: muted, fillOpacity: 0.55 }}
                        tickFormatter={(value) =>
                            typeof value === "number"
                                ? formatCompactVND(value)
                                : value
                        }
                        width={48}
                    />

                    <Tooltip
                        formatter={(value) =>
                            typeof value === "number"
                                ? [`${formatCompactVND(value)} `, "Doanh thu"]
                                : [value, "Doanh thu"]
                        }
                        contentStyle={{
                            borderRadius: 12,
                            border: `1px solid ${border}`,
                            fontSize: 13,
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={primary}
                        strokeWidth={2}
                        fill="url(#revenueFill)"
                    />
                </AreaChart>
            </ResponsiveContainer>
            {error && <ErrorMessage error={error} />}

            {isEmpty && !error && <NoData />}
        </div>
    );
}