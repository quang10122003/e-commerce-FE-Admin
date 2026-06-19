"use client";

import { useRef } from "react";
import Form from "next/form";
import { formatCurrency } from "@/lib/util/formatCurrency";
import { formatLocalDateTime } from "@/lib/util/formatDateTime";
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
      <p className="text-sm font-semibold text-rose-700">Không thể tải danh sách đơn hàng</p>
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
  const rows = orders ?? [];

  // Timeout debounce riêng cho ô search để hạn chế submit lại URL liên tục.
  const submitTimeoutRef = useRef<number | null>(null);

  // Submit form bằng GET để cập nhật URL và để Server Component fetch lại API.
  function submitFilter(form: HTMLFormElement, delay: number) {
    if (submitTimeoutRef.current) {
      window.clearTimeout(submitTimeoutRef.current);
    }

    submitTimeoutRef.current = window.setTimeout(() => {
      form.requestSubmit();
    }, delay);
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
          rows.map((order) => (
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
                          <p className="text-xs text-slate-500">{item.category ?? "Chưa phân loại"}</p>
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
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button className="btn-outline" type="button">
                      Cập nhật status
                    </button>
                    <button className="btn-outline-danger" type="button">
                      Hủy đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
