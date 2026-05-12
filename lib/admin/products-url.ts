import type { AdminProductsFilters } from "@/types/product";

type ProductsPageHrefOptions = {
  editingId?: number | null;
  filters: AdminProductsFilters;
  isCreating?: boolean;
  page?: number;
};

// Tao URL canonical cho trang products, giu lai filter hien tai va chi them query khac mac dinh.
export function buildProductsPageHref({
  editingId = null,
  filters,
  isCreating = false,
  page = filters.currentPage,
}: ProductsPageHrefOptions) {
  const params = new URLSearchParams();
  const search = filters.search.trim();

  if (search) {
    params.set("search", search);
  }

  if (filters.categoryFilter !== "ALL") {
    params.set("category", filters.categoryFilter);
  }

  if (filters.statusFilter !== "ALL") {
    params.set("status", filters.statusFilter);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  if (isCreating) {
    params.set("create", "1");
  } else if (editingId) {
    params.set("edit", String(editingId));
  }

  const query = params.toString();
  return `/admin/products${query ? `?${query}` : ""}`;
}
