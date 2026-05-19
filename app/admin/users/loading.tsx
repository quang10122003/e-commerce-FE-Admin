import { AdminRouteLoading } from "@/components/admin/AdminRouteLoading";

export default function UsersLoading() {
  return (
    <AdminRouteLoading
      description="Quản lý users, role và trạng thái lock theo dữ liệu backend."
      label="Đang tải dữ liệu users..."
      title="Users Management"
    />
  );
}
