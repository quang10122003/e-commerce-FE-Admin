"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useUpdateAdminOrderStatusMutation } from "@/client/api/backend-api";
import { useNotification } from "@/components/ui/BrowserNotification";
import {
  getAdminOrderStatusActions,
  getAdminOrderStatusConfirmMessage,
  getAdminOrderStatusSuccessMessage,
} from "@/features/order/services/admin-order-status-service";
import { useDebouncedFormSubmit } from "@/hooks/use-debounced-form-submit";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { formatCurrency } from "@/lib/util/formatCurrency";
import { formatLocalDateTime } from "@/lib/util/Date";
import type { AdminOrderItem, AdminOrdersFilters, OrderStatus } from "@/types/order";
import { StatusBadge } from "../StatusBadge";

type OrdersPanelProps = {
  error: string | null;
  filters: AdminOrdersFilters;
  orders: AdminOrderItem[] | null;
};

// Chọn màu badge theo trạng thái đơn hàng.
function getOrderStatusTone(status: OrderStatus) {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "danger";
    case "SHIPPING":
      return "info";
  }
}
// Hiển thị thông báo lỗi khi không lấy được dữ liệu.
function OrdersError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-8 text-center">
      <p className="text-sm font-semibold text-rose-700">
        Không thể tải danh sách đơn hàng
      </p>
      <p className="mt-1 text-xs text-rose-500">{message}</p>
    </div>
  );
}

// Hiển thị trạng thái rỗng khi không có order khớp bộ lọc.
function OrdersEmpty() {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
      Không tìm thấy đơn hàng phù hợp.
    </div>
  );
}

export function OrdersPanel({ error, filters, orders }: OrdersPanelProps) {
  const router = useRouter();
  const rows = orders ?? [];
  const submitFilter = useDebouncedFormSubmit();
  const { showNotification } = useNotification();
  const [isRoutePending, startRouteTransition] = useTransition();
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [updateAdminOrderStatus] = useUpdateAdminOrderStatusMutation();

  // Làm mới dữ liệu server sau khi API cập nhật trạng thái thành công.
  function refreshOrders() {
    startRouteTransition(() => {
      router.refresh();
    });
  }

  // Gọi API cập nhật trạng thái đơn hàng và hiển thị thông báo kết quả.
  async function handleUpdateOrderStatus(order: AdminOrderItem, status: OrderStatus) {
    const confirmed = window.confirm(
      getAdminOrderStatusConfirmMessage(order, status),
    );

    if (!confirmed) {
      return;
    }

    const actionKey = `${order.id}-${status}`;
    setActiveActionKey(actionKey);

    try {
      const payload = await updateAdminOrderStatus({
        orderId: order.id,
        status,
      }).unwrap();

      if (!payload.success) {
        throw new Error(
          getApiErrorMessage(
            payload,
            "Không thể cập nhật trạng thái đơn hàng.",
          )
        );
      }

      showNotification(getAdminOrderStatusSuccessMessage(status), {
        tone: "success",
      });
      refreshOrders();
    } catch (err) {
      showNotification(
        getApiErrorMessage(
          err,
          "Không thể cập nhật trạng thái đơn hàng.",
        ),
        { tone: "error" },
      );
    } finally {
      setActiveActionKey(null);
    }
  }

  return (
    <article className="panel mt-6">
      {/* Bộ lọc đơn hàng */}
      <Form
        action="/admin/orders"
        className="flex flex-wrap items-center gap-3"
        onChange={(event) => {
          const delay = event.target instanceof HTMLInputElement && event.target.type === "text" ? 350 : 0;
          submitFilter(event.currentTarget, delay);
        }}
        replace
        scroll={false}
      >
        <input
          className="field-input field-inline field-input-compact flex-1"
          defaultValue={filters.search}
          name="search"
          placeholder="Tìm theo order code / số điện thoại / người nhận..."
          type="text"
        />

        <select
          className="field-select h-10"
          defaultValue={filters.statusFilter}
          name="status"
        >
          <option value="ALL">Tất cả status</option>
          <option value="PENDING">PENDING</option>
          <option value="SHIPPING">SHIPPING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        {/* Lọc theo khoảng ngày tạo đơn */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <input
            className="field-input field-inline w-full sm:w-36"
            defaultValue={filters.from}
            name="from"
            type="date"
          />
          <span className="text-sm text-slate-400">-</span>
          <input
            className="field-input field-inline w-full sm:w-36"
            defaultValue={filters.to}
            name="to"
            type="date"
          />
        </div>
      </Form>

      {/* Danh sách đơn hàng */}
      <div className="mt-5 space-y-4">
        {error ? (
          <OrdersError message={error} />
        ) : rows.length === 0 ? (
          <OrdersEmpty />
        ) : (
          rows.map((order) => {
            const statusActions = getAdminOrderStatusActions(order);

            return (
            <div className="card-subtle" key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Order code</p>
                  <p className="text-lg font-bold text-slate-900">{order.orderCode}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p>Created: {formatLocalDateTime(order.createdAt)}</p>
                  <p>User ID: {order.userId ?? "Guest"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={getOrderStatusTone(order.status)}>
                    {order.status}
                  </StatusBadge>
                  {order.cancelledBy ? (
                      <span className="chip">
                        Hủy bởi {order.cancelledBy}
                      </span>
                  ) : null}
                  <span className="chip chip-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                  {/* Khu vực sản phẩm trong đơn */}
                <div className="panel-muted border-slate-200 bg-white">
                  <p className="text-sm font-semibold text-slate-800">Order items</p>
                  <div className="mt-3 space-y-2">
                    {order.items.map((item) => (
                      <div className="card-item" key={item.id}>
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">danh mục:{item.category ?? "Chưa phân loại"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-800">x{item.quantity}</p>
                          <p className="text-xs text-slate-500">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Khu vực thông tin giao hàng */}
                <div className="panel-muted border-slate-200 bg-white">
                  <p className="text-sm font-semibold text-slate-800">Shipping info</p>
                  <div className="mt-3 space-y-1.5 text-sm text-slate-700">
                    <p>
                        <span className="font-medium">Người nhận:</span> {order.shippingName}
                    </p>
                    <p>
                        <span className="font-medium">Điện thoại:</span> {order.shippingPhone}
                    </p>
                    <p>
                        <span className="font-medium">Địa chỉ:</span> {order.shippingAddress}
                    </p>
                      <p>
                        <span className="font-medium">Phương thức thanh toán:</span> {order.paymentMethod}
                      </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {statusActions.length ? (
                      statusActions.map((action) => {
                        const actionKey = `${order.id}-${action.status}`;
                        const isUpdating =
                          activeActionKey === actionKey || isRoutePending;

                        return (
                          <button
                            className={
                              action.tone === "danger"
                                ? "btn-outline-danger"
                                : "btn-outline"
                            }
                            disabled={isUpdating}
                            key={action.status}
                            onClick={() => {
                              void handleUpdateOrderStatus(order, action.status);
                            }}
                            type="button"
                          >
                            {isUpdating ? "Đang xử lý..." : action.label}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        Không còn thao tác trạng thái
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </article>
  );
}

