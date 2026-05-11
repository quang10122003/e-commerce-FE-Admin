import { PagedResponse } from "./api";
export const ADMIN_PRODUCTS_PAGE_SIZE = 10;
export type ProductStatus = "ACTIVE" | "INACTIVE"
export interface AdminProductImage{
    id:number
    url:string
    publicIdUrl:string
}

export interface AdminProductItem{
    id: number;
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

// data product tra về phân trang
export interface AdminProductListData{
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
export interface AdminProductsSearchParams  {
    page?: string | string[];
    search?: string | string[];
    category?: string | string[];
    status?: string | string[];
};
