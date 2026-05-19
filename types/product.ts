import { PagedResponse } from "./api";

export const ADMIN_PRODUCTS_PAGE_SIZE = 10;

export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface AdminProductImage {
    id: number;
    url: string;
    publicIdUrl: string;
}

export interface AdminProductItem {
    id: number;
    // Version do backend trả về, dùng lại khi update để backend phát hiện dữ liệu chỉnh sửa đã cũ.
    version: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    purchases: number;
    status: ProductStatus;
    categoryId: number;
    categoryName: string;
    thumbnail: string;
    images: AdminProductImage[];
    createdAt: string;
    updatedAt: string | null;
}

export type AdminProductSummaryResponse = AdminProductItem;

export interface AdminCreateProductData {
    name: string;
    description: string;
    price: number;
    stock: number;
    status: ProductStatus;
    categoryId: number;
}

export interface AdminCreateProductRequest extends AdminCreateProductData {
    thumbnail: File;
    images?: File[] | FileList | null;
}

// Chỉ dùng cho luồng cập nhật product: create/delete/status không cần gửi version.
export interface AdminUpdateProductRequest extends AdminCreateProductData {
    productId: number;
    // Version lấy từ product đang edit, backend sẽ so sánh với version hiện tại trong DB.
    version: number;
    thumbnail?: File | null;
    images?: File[] | FileList | null;
    // Danh sách URL ảnh cũ bị admin bỏ khỏi form; backend dùng URL để xóa entity ảnh tương ứng.
    deleteImageUrls?: string[];
}

// Data product tra ve phan trang.
export interface AdminProductListData {
    products: PagedResponse<AdminProductItem>;
}

export interface AdminProductsFilters {
    currentPage: number;
    search: string;
    categoryFilter: string;
    statusFilter: string;
}

export interface AdminProductsQueryParams {
    catagoryId?: number;
    search?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface AdminProductsSearchParams {
    page?: string | string[];
    search?: string | string[];
    category?: string | string[];
    status?: string | string[];
}

export type AdminProductStatusResponse = {
    productId: number;
    status: ProductStatus;
};

export type AdminProductStatusRequest = {
    productId: number;
    status: ProductStatus;
};
