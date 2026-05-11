import { BarChart3, Boxes, ImageIcon, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import type { CategorySummaryResponse } from "@/types/categories";
import type {
  AdminProductListData,
  AdminProductsFilters,
} from "@/types/product";
import type { ProductFormMode } from "@/components/admin/products/types";

type ProductsClinetProps = {
  // Data init lay tu Server Component: product list va danh sach category de render filter/form.
  data: {
    category: CategorySummaryResponse[] | null;
    product: AdminProductListData | null;
  };
  // ID product lay tu query edit tren URL, null nghia la chua chon product de sua.
  editingId: number | null;
  // Loi khi server fetch product/category that bai.
  error: {
    errorCategory: string | null;
    errorProduct: string | null;
  };
  // Bo loc hien tai da duoc parse tu searchParams o Server Component.
  filters: AdminProductsFilters;
  // Co lay tu query create=1, dung de mo form tao moi.
  isCreating: boolean;
};

type ProductsPageHrefOptions = {
  editingId?: number | null;
  filters: AdminProductsFilters;
  isCreating?: boolean;
  page?: number;
};

// Build URL giu lai bo loc hien tai khi chuyen page, mo edit hoac mo create.
function buildProductsPageHref({
  editingId = null,
  filters,
  isCreating = false,
  page = filters.currentPage,
}: ProductsPageHrefOptions) {
  const params = new URLSearchParams();
  const search = filters.search.trim();

  // Chi ghi query khi filter khac mac dinh de URL gon va de doc.
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

export default function ProductsClinet({
  data,
  editingId,
  error,
  filters,
  isCreating,
}: ProductsClinetProps) {
  // Product page la response phan trang tu backend; fallback rong giup UI van render on dinh khi loi API.
  const productPage = data.product?.products;
  const products = productPage?.items ?? [];
  const categories = data.category ?? [];
  const totalProduct = productPage?.totalItems ?? 0;
  const totalPages = Math.max(productPage?.totalPages ?? 1, 1);
  const currentPage = Math.min(Math.max(filters.currentPage, 1), totalPages);
  // Thong ke hien tinh theo product trong trang hien tai.
  const totalProductOutOfStock = products.filter(
    (product) => product.stock <= 0,
  ).length;
  const topSellingProduct = products.reduce(
    (topProduct, product) =>
      !topProduct || product.purchases > topProduct.purchases
        ? product
        : topProduct,
    null as (typeof products)[number] | null,
  );
  const totalImages = products.reduce(
    (total, product) => total + product.images.length + 1,
    0,
  );

  // Neu dang create thi form khong can product edit; neu edit thi tim product trong page hien tai.
  const productEdit = isCreating
    ? null
    : products.find((product) => product.id === editingId) ?? null;
  // Mode dieu khien trang thai form: idle khoa form, create tao moi, edit chinh sua.
  const formMode: ProductFormMode = isCreating
    ? "create"
    : productEdit
      ? "edit"
      : "idle";
  // Link phan trang duoc build san de Pagination dung Link cua Next thay vi client router.
  const previousHref =
    currentPage > 1
      ? buildProductsPageHref({
          filters,
          page: currentPage - 1,
        })
      : undefined;
  const nextHref =
    currentPage < totalPages
      ? buildProductsPageHref({
          filters,
          page: currentPage + 1,
        })
      : undefined;

  return (
    <section>
      <PageHeader
        actionHref="/admin/products?create=1"
        actionLabel="Them product"
        description="UI quan ly products + product_images theo schema DB."
        title="Products Management"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Boxes className="size-5" />}
          note="Tong so san pham trong DB"
          title="Tong products"
          value={String(totalProduct)}
        />
        <StatCard
          icon={<BarChart3 className="size-5" />}
          note="Top selling trong 30 ngay"
          title="Ban chay nhat"
          tone="emerald"
          value={topSellingProduct?.name ?? "-"}
        />
        <StatCard
          icon={<PackagePlus className="size-5" />}
          note="So san pham het hang trong trang hien tai"
          title="Het hang"
          tone="amber"
          value={String(totalProductOutOfStock)}
        />
        <StatCard
          icon={<ImageIcon className="size-5" />}
          note="Tong so anh product_images trong trang hien tai"
          title="Library anh"
          tone="violet"
          value={String(totalImages)}
        />
      </div>

      <article className="panel mt-6">
        <ProductFilters categories={data.category} filters={filters} />

        {/* Hien thi loi fetch data ngay trong panel list de nguoi dung biet list/filter dang bi anh huong. */}
        {error.errorProduct ? (
          <p className="mt-3 text-sm text-error">{error.errorProduct}</p>
        ) : null}
        {error.errorCategory ? (
          <p className="mt-3 text-sm text-error">{error.errorCategory}</p>
        ) : null}

        <ProductsTable
          activeProductId={productEdit?.id ?? null}
          getEditHref={(productId) =>
            buildProductsPageHref({
              editingId: productId,
              filters,
              page: currentPage,
            })
          }
          pagination={{
            currentPage,
            nextHref,
            previousHref,
            totalItems: totalProduct,
            totalPages,
          }}
          products={products}
        />
      </article>

      <div className="mt-6">
        <ProductForm
          // Doi key de reset form/preview khi chuyen giua create, edit hoac idle.
          key={isCreating ? "create-product" : productEdit?.id ?? "idle-product"}
          categories={categories}
          mode={formMode}
          productEdit={productEdit}
        />
      </div>
    </section>
  );
}
