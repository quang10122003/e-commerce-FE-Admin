import { AdminRouteLoading } from "@/components/admin/AdminRouteLoading";

export default function ProductsLoading() {
  return (
    <AdminRouteLoading
      description="UI quản lý products + product_images theo schema DB."
      label="Đang tải dữ liệu products..."
      title="Products Management"
    />
  );
}
