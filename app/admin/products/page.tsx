import { buildAdminProductsBackendPath, buildAdminProductsQueryParams, parseAdminProductsFilters } from "@/server/admin-products";
import ProductsClinet from "./ProductsClinet";
import type { NextSearchParams } from "@/types/next";
import { AdminProductListData, AdminProductsFilters } from "@/types/product";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { CategorySummaryResponse } from "@/types/categories";
import { redirect } from "next/navigation";
import { buildProductsPageHref } from "@/lib/admin/products-url";
const CATEGORY_API = "admin/categorie"

// Chuẩn hóa giá trị query vì Next có thể trả về string hoặc mảng string.
function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}


// Goi song song API product va category de init UI list/filter/form.
async function getAdminproductInitialData(filters: AdminProductsFilters) {
  const [dataProduct, dataCategory] = await Promise.allSettled([
    serverPrivateFetch<AdminProductListData>(
      buildAdminProductsBackendPath(buildAdminProductsQueryParams(filters)),
    ),
    serverPrivateFetch<CategorySummaryResponse[]>(CATEGORY_API),
  ])
  return {
    data: {
      product: dataProduct.status === "fulfilled" ? dataProduct.value.data : null,
      category: dataCategory.status === "fulfilled" ? dataCategory.value.data : null
    },
    error: {
      errorProduct: dataProduct.status === "rejected" ? getApiErrorMessage(dataProduct.reason, "ko lay dc data san pham") : null,
      errorCategory: dataCategory.status === "rejected"
        ? "_"
        : null,
    },
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: NextSearchParams }) {
  // searchParams là Promise theo kiểu NextSearchParams của dự án, nên cần await trước khi đọc.
  const params = await searchParams;
  // tạo ra ojt filter
  const filters = parseAdminProductsFilters(params)
  // Query create=1 sẽ mở form ở mode tạo mới.
  const isCreating = getParamValue(params.create) === "1";
  // Query edit=<id> sẽ mở form ở mode chỉnh sửa đúng product đó; không có edit thì để null.
  const editingId = Number(getParamValue(params.edit)) || null;

  // gọi api lấy init data
  const { data, error } = await getAdminproductInitialData(filters)
  const productPage = data.product?.products;
  const totalPages = Math.max(productPage?.totalPages ?? 1, 1);

  // Neu URL yeu cau page vuot tong so trang, redirect ve page cuoi de lan render sau fetch dung data.
  if (productPage && filters.currentPage > totalPages) {
    redirect(
      buildProductsPageHref({
        editingId,
        filters,
        isCreating,
        page: totalPages,
      }),
    );
  }

  return <ProductsClinet data={data} error={error} editingId={editingId} isCreating={isCreating} filters={filters} />;
}
