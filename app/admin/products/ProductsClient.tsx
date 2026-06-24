import { BarChart3, Boxes, ImageIcon, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { createAdminProductViewModel } from "@/features/product/mappers/admin-product-view-model";
import type {
  AdminProductInitialData,
  AdminProductInitialError,
} from "@/features/product/services/admin-product-service";
import type { AdminProductsFilters } from "@/types/product";

type ProductsClientProps = {
  // Data init lay tu Server Component: product list va danh sach category de render filter/form.
  data: AdminProductInitialData;
  // ID product lay tu query edit tren URL, null nghia la chua chon product de sua.
  editingId: number | null;
  // Loi khi server fetch product/category that bai.
  error: AdminProductInitialError;
  // Bo loc hien tai da duoc parse tu searchParams o Server Component.
  filters: AdminProductsFilters;
  // Co lay tu query create=1, dung de mo form tao moi.
  isCreating: boolean;
};

export default function ProductsClient({
  data,
  editingId,
  error,
  filters,
  isCreating,
}: ProductsClientProps) {
  const { categories, formMode, pagination, productEdit, products, stats } =
    createAdminProductViewModel({ data, editingId, filters, isCreating });
  const errorCategory = error?.errorCategory;

  return (
    <section>
      <PageHeader
        actionHref="/admin/products?create=1#product-form"
        actionLabel="Them product"
        description="UI quan ly products + product_images theo schema DB."
        title="Products Management"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Boxes className="size-5" />}
          note="Tong so san pham trong DB"
          title="Tong products"
          value={String(stats.totalProduct)}
        />
        <StatCard
          icon={<BarChart3 className="size-5" />}
          note="Top selling trong 30 ngay"
          title="Ban chay nhat"
          tone="emerald"
          value={stats.topSellingProduct?.name ?? "-"}
        />
        <StatCard
          icon={<PackagePlus className="size-5" />}
          note="So san pham het hang trong trang hien tai"
          title="Het hang"
          tone="amber"
          value={String(stats.totalProductOutOfStock)}
        />
        <StatCard
          icon={<ImageIcon className="size-5" />}
          note="Tong so anh product_images trong trang hien tai"
          title="Library anh"
          tone="violet"
          value={String(stats.totalImages)}
        />
      </div>

      <article className="panel mt-6">
        <ProductFilters errorCategory={errorCategory} categories={data.category} filters={filters} />

        {/* error khi lấy sản phẩm*/}
        {error.errorProduct ? (
          <p className="mt-3 text-sm text-error">{error.errorProduct}</p>
        ) : null}

        <ProductsTable
          activeProductId={productEdit?.id ?? null}
          filters={filters}
          pagination={pagination}
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
