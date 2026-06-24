import { buildProductsPageHref } from "@/lib/admin/products-url";
import type { ProductFormMode } from "@/components/admin/products/types";
import type { AdminProductInitialData } from "@/features/product/services/admin-product-service";
import type { AdminProductItem, AdminProductsFilters } from "@/types/product";

type CreateAdminProductViewModelInput = {
  data: AdminProductInitialData;
  editingId: number | null;
  filters: AdminProductsFilters;
  isCreating: boolean;
};

type AdminProductPaginationViewModel = {
  currentPage: number;
  nextHref?: string;
  previousHref?: string;
  totalItems: number;
  totalPages: number;
};

type AdminProductStatsViewModel = {
  topSellingProduct: AdminProductItem | null;
  totalImages: number;
  totalProduct: number;
  totalProductOutOfStock: number;
};

export type AdminProductViewModel = {
  categories: NonNullable<AdminProductInitialData["category"]>;
  formMode: ProductFormMode;
  pagination: AdminProductPaginationViewModel;
  productEdit: AdminProductItem | null;
  products: AdminProductItem[];
  stats: AdminProductStatsViewModel;
};

// Tạo dữ liệu đã tính sẵn để component product chỉ tập trung render UI.
export function createAdminProductViewModel({
  data,
  editingId,
  filters,
  isCreating,
}: CreateAdminProductViewModelInput): AdminProductViewModel {
  const productPage = data.product?.products;
  const products = productPage?.items ?? [];
  const categories = data.category ?? [];
  const totalProduct = productPage?.totalItems ?? 0;
  const totalPages = Math.max(productPage?.totalPages ?? 1, 1);
  const currentPage = Math.min(Math.max(filters.currentPage, 1), totalPages);

  // Thống kê hiện tính theo product trong trang hiện tại.
  const totalProductOutOfStock = products.filter((product) => product.stock <= 0).length;
  const topSellingProduct = products.reduce(
    (topProduct, product) =>
      !topProduct || product.purchases > topProduct.purchases ? product : topProduct,
    null as AdminProductItem | null,
  );
  const totalImages = products.reduce(
    (total, product) => total + product.images.length + 1,
    0,
  );

  // Nếu đang create thì form không cần product edit; nếu edit thì tìm product trong trang hiện tại.
  const productEdit = isCreating
    ? null
    : products.find((product) => product.id === editingId) ?? null;
  const formMode: ProductFormMode = isCreating ? "create" : productEdit ? "edit" : "idle";

  return {
    categories,
    formMode,
    pagination: {
      currentPage,
      nextHref:
        currentPage < totalPages
          ? buildProductsPageHref({
              filters,
              page: currentPage + 1,
            })
          : undefined,
      previousHref:
        currentPage > 1
          ? buildProductsPageHref({
              filters,
              page: currentPage - 1,
            })
          : undefined,
      totalItems: totalProduct,
      totalPages,
    },
    productEdit,
    products,
    stats: {
      topSellingProduct,
      totalImages,
      totalProduct,
      totalProductOutOfStock,
    },
  };
}
