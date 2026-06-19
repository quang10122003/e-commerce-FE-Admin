import "server-only";

import { readSearchParam } from "@/lib/util/readSearchParam";
import {
  AdminOrdersFilters,
  AdminOrdersQueryParams,
  AdminOrdersSearchParams,
  OrderStatusFilter,
} from "@/types/order";

// Chuyển query object thành URLSearchParams để gọi backend.
export function buildAdminOrdersSearchParams(
  params: AdminOrdersQueryParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);

  return searchParams;
}

// Tạo path backend đầy đủ kèm query string nếu có filter.
export function buildAdminOrdersBackendPath(
  params: AdminOrdersQueryParams,
): string {
  const qs = buildAdminOrdersSearchParams(params).toString();
  return `/admin/orders${qs ? `?${qs}` : ""}`;
}

// Đọc searchParams từ URL và đưa về filter nội bộ của trang orders.
export function parseAdminOrdersFilters(
  searchParams: AdminOrdersSearchParams,
): AdminOrdersFilters {
  return {
    search: readSearchParam(searchParams.search).trim(),
    statusFilter: (readSearchParam(searchParams.status, "ALL") as OrderStatusFilter) || "ALL",
    from: readSearchParam(searchParams.from),
    to: readSearchParam(searchParams.to),
  };
}

// Loại bỏ field rỗng hoặc ALL trước khi gửi lên backend.
export function buildAdminOrdersQueryParams(
  filters: AdminOrdersFilters,
): AdminOrdersQueryParams {
  return {
    search: filters.search || undefined,
    status: filters.statusFilter === "ALL" ? undefined : filters.statusFilter,
    from: filters.from || undefined,
    to: filters.to || undefined,
  };
}
