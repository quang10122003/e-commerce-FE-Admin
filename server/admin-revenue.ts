import "server-only";
import { RevenueFilters, RevenueQueryParams } from "@/types/revenue";
import { getISOWeek } from "@/lib/util/Date";

// Hàm parse searchParams từ URL thành RevenueFilters
export function parseRevenueFilters(
    searchParams: Record<string, string | string[] | undefined>
): RevenueFilters {
    const type = (searchParams.type as RevenueFilters["type"]) || "WEEK";
    const year = parseInt(searchParams.year as string) || new Date().getFullYear();
    const week = parseInt(searchParams.week as string) || getISOWeek(new Date());
    const month = parseInt(searchParams.month as string) || new Date().getMonth() + 1;
    return { type, year, week, month };
}

// Xây dựng query params để gửi lên backend (loại bỏ field không cần thiết)
export function buildRevenueQueryParams(filters: RevenueFilters): RevenueQueryParams {
    return {
        type: filters.type,
        year: filters.year,
        month: filters.month,
        week: filters.week
    }

}
export function buildRevenueSearchParams(
    params: RevenueQueryParams,
): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params.type) searchParams.set("type", params.type);
    if (params.year) searchParams.set("year", params.year.toString());
    if (params.week) searchParams.set("week", params.week.toString());
    if (params.month) searchParams.set("month", params.month.toString());

    return searchParams;
}

// Tạo path backend với query string
export function buildRevenueBackendPath(params: RevenueQueryParams): string {
    const qs = buildRevenueSearchParams(params).toString();
    console.log(qs)
    return `admin/revenue${qs ? `?${qs}` : ""}`;

}
