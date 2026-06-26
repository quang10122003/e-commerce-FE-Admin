// components/PeriodPicker.tsx
// Bộ chọn kỳ thống kê 2 tầng – hiển thị khoảng ngày cho tuần và tháng.

import { RevenueFilters, PeriodType } from "@/types/revenue";
import { MONTH_NAMES, getDateOfISOWeek, formatShortDate } from "@/lib/util/Date";
import { useMemo } from "react";

const PERIOD_TYPE_OPTIONS: { value: PeriodType; label: string }[] = [
    { value: "WEEK", label: "Theo tuần" },
    { value: "MONTH", label: "Theo tháng" },
    { value: "YEAR", label: "Theo năm" },
];

// Danh sách tuần cố định (1 -> 53)
const WEEK_OPTIONS = Array.from({ length: 53 }, (_, i) => i + 1);

// Hàm sinh danh sách năm: từ 3 năm trước đến năm hiện tại
const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, i) => currentYear - i);
};

export function PeriodPicker({
    selection,
    onChange,
}: {
        selection: RevenueFilters;
        onChange: (next: RevenueFilters) => void;
}) {
    // Danh sách năm được tính 1 lần khi component mount
    const yearOptions = useMemo(() => getYearOptions(), []);

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Ô chọn loại kỳ */}
            <select
                className="field-select"
                value={selection.type}
                onChange={(e) =>
                    onChange({
                        ...selection,
                        type: e.target.value as PeriodType,
                    })
                }
            >
                {PERIOD_TYPE_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                        {p.label}
                    </option>
                ))}
            </select>

            {/* Ô chọn tuần (chỉ hiện khi type === "week") */}
            {selection.type === "WEEK" && (
                <select
                    className="field-select"
                    value={selection.week}
                    onChange={(e) => onChange({ ...selection, week: Number(e.target.value) })}
                >
                    {WEEK_OPTIONS.map((w) => {
                        // Tính ngày thứ Hai và Chủ Nhật của tuần w trong năm selection.year
                        const monday = getDateOfISOWeek(w, selection.year);
                        const sunday = new Date(monday);
                        sunday.setUTCDate(monday.getUTCDate() + 6);
                        const label = `Tuần ${w} (${formatShortDate(monday)} - ${formatShortDate(sunday)})`;
                        return (
                            <option key={w} value={w}>
                                {label}
                            </option>
                        );
                    })}
                </select>
            )}

            {/* Ô chọn tháng (chỉ hiện khi type === "month") */}
            {selection.type === "MONTH" && (
                <select
                    className="field-select"
                    value={selection.month}
                    onChange={(e) => onChange({ ...selection, month: Number(e.target.value) })}
                >
                    {MONTH_NAMES.map((name, index) => {
                        const month = index + 1;
                        const label = `${name}/${selection.year}`;
                        return (
                            <option key={month} value={month}>
                                {label}
                            </option>
                        );
                    })}
                </select>
            )}

            {/* Ô chọn năm (luôn hiện) */}
            <select
                className="field-select"
                value={selection.year}
                onChange={(e) => onChange({ ...selection, year: Number(e.target.value) })}
            >
                {yearOptions.map((y) => (
                    <option key={y} value={y}>
                        Năm {y}
                    </option>
                ))}
            </select>
        </div>
    );
}