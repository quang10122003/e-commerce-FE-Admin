import ProductsClient from "./ProductsClient";
import { getAdminProductInitialData } from "@/features/product/services/admin-product-service";
import { buildProductsPageHref } from "@/lib/admin/products-url";
import { readSearchParam } from "@/lib/util/readSearchParam";
import { parseAdminProductsFilters } from "@/server/admin-products";
import type { NextSearchParams } from "@/types/next";
import { redirect } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const filters = parseAdminProductsFilters(params);
  const isCreating = readSearchParam(params.create) === "1";
  const editingId = Number(readSearchParam(params.edit)) || null;

  const { data, error } = await getAdminProductInitialData(filters);
  const productPage = data.product?.products;
  const totalPages = Math.max(productPage?.totalPages ?? 1, 1);

  // Nếu URL yêu cầu page vượt tổng số trang, redirect về page cuối để fetch lại đúng data.
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

  return (
    <ProductsClient
      data={data}
      editingId={editingId}
      error={error}
      filters={filters}
      isCreating={isCreating}
    />
  );
}
