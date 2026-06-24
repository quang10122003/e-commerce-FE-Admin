import type { AdminOrderItem, OrderStatus } from "@/types/order";

export type AdminOrderStatusAction = {
  label: string;
  status: OrderStatus;
  tone: "default" | "danger";
};

// Trả về các trạng thái admin được phép chuyển tiếp theo trạng thái hiện tại.
export function getAdminOrderStatusActions(
  order: AdminOrderItem,
): AdminOrderStatusAction[] {
  switch (order.status) {
    case "PENDING":
      // Đơn thanh toán qua ngân hàng (không phải COD) sẽ tự động chuyển
      // sang SHIPPING ở backend khi nhận được tiền, nên ở đây chỉ cho phép Hủy đơn.
      if (order.paymentMethod !== "COD") {
        return [{ label: "Hủy đơn", status: "CANCELLED", tone: "danger" }];
      }

      return [
        { label: "Giao hàng", status: "SHIPPING", tone: "default" },
        { label: "Hủy đơn", status: "CANCELLED", tone: "danger" },
      ];
    case "SHIPPING":
      return [
        { label: "Hoàn tất", status: "COMPLETED", tone: "default" },
        { label: "Hủy đơn", status: "CANCELLED", tone: "danger" },
      ];
    case "COMPLETED":
    case "CANCELLED":
      return [];
  }
}

// Tạo nội dung confirm trước khi gọi API đổi trạng thái đơn hàng.
export function getAdminOrderStatusConfirmMessage(
  order: AdminOrderItem,
  status: OrderStatus,
) {
  return `Bạn có chắc muốn chuyển đơn ${order.orderCode} sang ${status}?`;
}

// Tạo thông báo thành công sau khi API đổi trạng thái trả về thành công.
export function getAdminOrderStatusSuccessMessage(status: OrderStatus) {
  return `Đã cập nhật trạng thái đơn hàng sang ${status}.`;
}
