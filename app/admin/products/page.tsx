import { BarChart3, Boxes, ImageIcon, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ProductEditForm } from "@/components/admin/products/ProductEditForm";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { ProductImagesPanel } from "@/components/admin/products/ProductImagesPanel";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import type { Product } from "@/components/admin/products/types";

const products: Product[] = [
  {
    id: 101,
    name: "iPhone 16 Pro 256GB",
    category: "Dien thoai",
    price: "31,990,000",
    stock: 12,
    purchases: 214,
    status: "ACTIVE",
  },
  {
    id: 102,
    name: "MacBook Air M4",
    category: "Laptop",
    price: "28,490,000",
    stock: 8,
    purchases: 93,
    status: "ACTIVE",
  },
  {
    id: 103,
    name: "Tai nghe Bluetooth MaxSound",
    category: "Phu kien",
    price: "1,590,000",
    stock: 0,
    purchases: 307,
    status: "INACTIVE",
  },
  {
    id: 104,
    name: "May loc khong khi AirHome",
    category: "Gia dung",
    price: "3,290,000",
    stock: 6,
    purchases: 61,
    status: "ACTIVE",
  },
];

const images = [
  "/images/products/iphone-main.jpg",
  "/images/products/iphone-side.jpg",
  "/images/products/iphone-back.jpg",
];

export default function ProductsPage() {
  return (
    <section>
      <PageHeader
        actionHref="#"
        actionLabel="Them product"
        description="UI quan ly products + product_images theo schema DB."
        title="Products Management"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Boxes className="size-5" />}
          note="Tong so san pham trong DB"
          title="Tong products"
          value="168"
        />
        <StatCard
          icon={<BarChart3 className="size-5" />}
          note="Top selling trong 30 ngay"
          title="Ban chay nhat"
          tone="emerald"
          value="Tai nghe MaxSound"
        />
        <StatCard
          icon={<PackagePlus className="size-5" />}
          note="Con stock > 0 va dang active"
          title="Co the ban"
          tone="blue"
          value="143"
        />
        <StatCard
          icon={<ImageIcon className="size-5" />}
          note="Tong so anh product_images"
          title="Library anh"
          tone="violet"
          value="537"
        />
      </div>

      <article className="panel mt-6">
        <ProductFilters />
        <ProductsTable products={products} />
      </article>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <ProductEditForm />
        <ProductImagesPanel images={images} />
      </div>
    </section>
  );
}
