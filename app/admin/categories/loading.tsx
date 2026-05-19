import { AdminRouteLoading } from "@/components/admin/AdminRouteLoading";

export default function CategoriesLoading() {
  return (
    <AdminRouteLoading
      description="Quản lý categories, ảnh đại diện và trạng thái hiển thị."
      label="Đang tải dữ liệu categories..."
      title="Categories Management"
    />
  );
}
