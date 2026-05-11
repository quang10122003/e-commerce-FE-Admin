import "server-only";
import { ADMIN_PRODUCTS_PAGE_SIZE, AdminProductsFilters, AdminProductsQueryParams, AdminProductsSearchParams } from "@/types/product";

// Chuẩn hóa search param về string: lấy phần tử đầu nếu là array, dùng fallback nếu undefined
function readSearchParam(value:string | string[] | undefined , fallback=""){
    return Array.isArray(value) ? value[0] ?? fallback : value ??fallback
}
// tạo url param cho việc call api backend
export function buildAdminProductsSearchParams(params: AdminProductsQueryParams){
    const searchParams = new URLSearchParams()

    if(params.search) searchParams.set("search",params.search)
    if(typeof params.catagoryId === "number"){
        searchParams.set("catagoryId",params.catagoryId.toString())
    }
    if (params.status) searchParams.set("status", params.status);
    if (typeof params.page === "number") searchParams.set("page", params.page.toString());
    if (typeof params.size === "number") searchParams.set("size", params.size.toString());

    return searchParams;

}

// build url hoàn thiện với filter  để call api backed
export function buildAdminProductsBackendPath(params:AdminProductsQueryParams){
    const queryFilterString  = buildAdminProductsSearchParams(params)
    return `/admin/products${queryFilterString ? `?${queryFilterString}` : ""}`
}


export function parseAdminProductsFilters(searchParams: AdminProductsSearchParams): AdminProductsFilters{
    const rawPage = Number.parseInt(readSearchParam(searchParams.page , "1"),10)
    return {
        currentPage:Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1 ,
        search: readSearchParam(searchParams.search).trim(),
        categoryFilter: readSearchParam(searchParams.category, "ALL") || "ALL",
        statusFilter: readSearchParam(searchParams.status, "ALL") || "ALL",
    }
}


export function buildAdminProductsQueryParams(filters: AdminProductsFilters) {
    return {
        page: Math.max(filters.currentPage - 1, 0),
        size: ADMIN_PRODUCTS_PAGE_SIZE,
        search: filters.search || undefined,
        status: filters.statusFilter === "ALL" ? undefined : filters.statusFilter,
        catagoryId:
            filters.categoryFilter === "ALL"
                ? undefined
                : Number(filters.categoryFilter),
    } satisfies AdminProductsQueryParams;
}