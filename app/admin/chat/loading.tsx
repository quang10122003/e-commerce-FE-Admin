import { AdminRouteLoading } from "@/components/admin/AdminRouteLoading";

export default function ChatLoading() {
  return (
    <AdminRouteLoading
      description="Theo dõi chat_rooms và messages, gán admin phụ trách cho từng room."
      label="Đang tải dữ liệu chat..."
      title="Chat Management"
    />
  );
}
