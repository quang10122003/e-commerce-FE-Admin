import {
    AdminPaymentsFilters,
    AdminPaymentsQueryParams,
    AdminPaymentsSearchParams,
    PaymentStatusFilter,
} from "@/types/payment";
import { readSearchParam } from "@/lib/util/readSearchParam";

// ─── Build URLSearchParams để gọi backend ────────────────────────────────────

/** Chuyển AdminPaymentsQueryParams thành URLSearchParams để đính vào endpoint. */
export function buildAdminPaymentsSearchParams(
    params: AdminPaymentsQueryParams,
): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.from) searchParams.set("from", params.from);
    if (params.to) searchParams.set("to", params.to);

    return searchParams;
}

// ─── Build đường dẫn endpoint backend ────────────────────────────────────────

/** Tạo path đầy đủ để gọi API backend, bao gồm query string nếu có. */
export function buildAdminPaymentBackendPath(
    params: AdminPaymentsQueryParams,
): string {
    const qs = buildAdminPaymentsSearchParams(params).toString();
    return `/admin/payments${qs ? `?${qs}` : ""}`;
}

// ─── Parse search params từ URL → AdminPaymentsFilters ───────────────────────

/**
 * Đọc Next.js searchParams từ URL và chuyển thành AdminPaymentsFilters.
 * Giá trị mặc định: statusFilter = "ALL", các field còn lại là chuỗi rỗng.
 */
export function parseAdminPaymentsFilters(
    searchParams: AdminPaymentsSearchParams,
): AdminPaymentsFilters {
    return {
        search: readSearchParam(searchParams.search).trim(),
        statusFilter: (readSearchParam(searchParams.status, "ALL") as PaymentStatusFilter) || "ALL",
        from: readSearchParam(searchParams.from),
        to: readSearchParam(searchParams.to),
    };
}

// ─── Chuyển AdminPaymentsFilters → AdminPaymentsQueryParams ──────────────────

/**
 * Map từ filter nội bộ (có "ALL") sang query params gửi lên backend.
 * Các field rỗng hoặc "ALL" sẽ bị loại bỏ để không gửi param thừa.
 */
export function buildAdminPaymentsQueryParams(
    filters: AdminPaymentsFilters,
): AdminPaymentsQueryParams {
    return {
        search: filters.search || undefined,
        status: filters.statusFilter === "ALL" ? undefined : filters.statusFilter,
        from: filters.from || undefined,
        to: filters.to || undefined,
    };
}