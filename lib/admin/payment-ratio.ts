import { AdminPaymentsResponse } from "@/types/payment";

export type RatioKey = "paid" | "paidLate" | "pending" | "failed";

export interface RatioItem {
    key: RatioKey;
    label: string;
    amount: number;
    percentage: string;
    bar: string;
    dot: string;
    text: string;
}

const RATIO_CONFIG: Omit<RatioItem, "amount" | "percentage">[] = [
    {
        key: "paid",
        label: "Paid",
        bar: "var(--ratio-paid)",
        dot: "bg-[var(--ratio-paid)]",
        text: "text-[var(--ratio-paid-text)]",
    },
    {
        key: "paidLate",
        label: "Paid late",
        bar: "var(--ratio-paid-late)",
        dot: "bg-[var(--ratio-paid-late)]",
        text: "text-[var(--ratio-paid-late-text)]",
    },
    {
        key: "pending",
        label: "Pending",
        bar: "var(--ratio-pending)",
        dot: "bg-[var(--ratio-pending)]",
        text: "text-[var(--ratio-pending-text)]",
    },
    {
        key: "failed",
        label: "Failed",
        bar: "var(--ratio-failed)",
        dot: "bg-[var(--ratio-failed)]",
        text: "text-[var(--ratio-failed-text)]",
    },
];

export function buildRatioItems(
    dataOver: Omit<AdminPaymentsResponse, "item"> | null
): RatioItem[] {
    const amounts: Record<RatioKey, number> = {
        paid: dataOver?.paid ?? 0,
        paidLate: dataOver?.paidLate ?? 0,
        pending: dataOver?.pending ?? 0,
        failed: dataOver?.failed ?? 0,
    };

    const total = Object.values(amounts).reduce((sum, v) => sum + v, 0);

    return RATIO_CONFIG.map((config) => ({
        ...config,
        amount: amounts[config.key],
        percentage: total > 0
            ? ((amounts[config.key] / total) * 100).toFixed(1)
            : "0.0",
    }));
}

export function calcTotal(items: RatioItem[]): number {
    return items.reduce((sum, s) => sum + s.amount, 0);
}