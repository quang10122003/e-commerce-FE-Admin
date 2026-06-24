"use client";

import Form from "next/form";
import { useDebouncedFormSubmit } from "@/hooks/use-debounced-form-submit";
import { formatLocalDateTime } from "@/lib/util/formatDateTime";
import type { AdminPaymentItem, AdminPaymentsFilters, PaymentStatus } from "@/types/payment";

// Trả về CSS class của chip tương ứng với trạng thái thanh toán.
function statusChipClass(status: PaymentStatus): string {
    switch (status) {
        case "PAID": return "chip chip-success";
        case "PAID_LATE": return "chip chip-paid-late";
        case "PENDING": return "chip chip-warning";
        case "FAILED": return "chip chip-danger";
    }
}

// Trả về nhãn hiển thị cho từng trạng thái thanh toán.
function statusLabel(status: PaymentStatus): string {
    switch (status) {
        case "PAID": return "Paid";
        case "PAID_LATE": return "Paid late";
        case "PENDING": return "Pending";
        case "FAILED": return "Failed";
    }
}

// Trả về CSS class của chip cho phương thức thanh toán.
function methodChipClass(method: string): string {
    switch (method) {
        case "SEPAY": return "chip chip-primary";
        case "COD": return "chip chip-warning";
        default: return "chip chip-primary";
    }
}

// Hiển thị hàng lỗi toàn bảng khi fetch thất bại.
function TableError({ message }: { message: string }) {
    return (
        <tr>
            <td colSpan={6}>
                <div className="flex flex-col items-center gap-2 py-10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-error)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: "var(--color-error)" }}>
                        Không thể tải dữ liệu
                    </p>
                    <p className="text-xs text-slate-400">{message}</p>
                </div>
            </td>
        </tr>
    );
}

// Hiển thị hàng thông báo khi không có giao dịch nào khớp filter.
function TableEmpty() {
    return (
        <tr>
            <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                Không tìm thấy giao dịch phù hợp.
            </td>
        </tr>
    );
}

interface PaymentTableProps {
    // Danh sách giao dịch từ server, null nếu fetch thất bại.
    payments: AdminPaymentItem[] | null;
    // Thông báo lỗi từ server, hiển thị trực tiếp lên bảng nếu có.
    error: string | null;
    // Bộ lọc hiện tại lấy từ URL và truyền xuống từ Server Component.
    filters: AdminPaymentsFilters;
}

export function PaymentTable({ payments, error, filters }: PaymentTableProps) {
    const rows = payments ?? [];
    const submitFilter = useDebouncedFormSubmit();

    return (
        <article className="panel overflow-hidden">
            {/* Khu vực tiêu đề và bộ lọc */}
            <div className="flex flex-col gap-4">
                <h2 className="section-title">Danh sách giao dịch</h2>

                <Form
                    action="/admin/payments"
                    className="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-[minmax(220px,1fr)_180px] 2xl:grid-cols-[minmax(240px,280px)_180px_minmax(320px,1fr)]"
                    onChange={(event) => {
                        const delay = event.target instanceof HTMLInputElement && event.target.type === "text" ? 350 : 0;
                        submitFilter(event.currentTarget, delay);
                    }}
                    replace
                    scroll={false}
                >
                    {/* Tìm kiếm theo transaction ref hoặc order code */}
                    <input
                        className="field-input h-11 w-full"
                        defaultValue={filters.search}
                        name="search"
                        placeholder="Transaction ref..."
                        type="text"
                    />

                    {/* Lọc theo trạng thái thanh toán */}
                    <select
                        className="field-select h-11 w-full"
                        defaultValue={filters.statusFilter}
                        name="status"
                    >
                        <option value="ALL">All status</option>
                        <option value="PAID">Paid</option>
                        <option value="PAID_LATE">Paid late</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>

                    {/* Lọc theo khoảng ngày thanh toán */}
                    <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 md:col-span-2 md:max-w-[430px] 2xl:col-span-1 2xl:max-w-none">
                        <input
                            className="field-input h-11 min-w-0"
                            defaultValue={filters.from}
                            name="from"
                            type="date"
                        />
                        <span className="text-sm text-slate-400">-</span>
                        <input
                            className="field-input h-11 min-w-0"
                            defaultValue={filters.to}
                            name="to"
                            type="date"
                        />
                    </div>

                </Form>
            </div>

            {/* Khu vực bảng dữ liệu */}
            <div className="mt-5 max-h-[400px] w-full overflow-auto rounded-lg border border-slate-100 scrollbar-glass">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_rgba(226,232,240,1)]">
                        <tr className="text-slate-500">
                            <th className="px-4 py-3 font-medium">Payment ID</th>
                            <th className="px-4 py-3 font-medium">Order code</th>
                            <th className="px-4 py-3 font-medium">Method</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Transaction ref</th>
                            <th className="px-4 py-3 font-medium">Paid at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Ưu tiên hiển thị lỗi trước, sau đó mới kiểm tra dữ liệu rỗng */}
                        {error ? (
                            <TableError message={error} />
                        ) : rows.length === 0 ? (
                            <TableEmpty />
                        ) : (
                            rows.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                                >
                                    <td className="px-4 py-3 font-semibold text-slate-800">#{payment.id}</td>
                                    <td className="px-4 py-3 text-slate-700">{payment.orderCode}</td>
                                    <td className="px-4 py-3">
                                        <span className={methodChipClass(payment.method)}>{payment.method}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={statusChipClass(payment.status)}>{statusLabel(payment.status)}</span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{payment.transactionRef}</td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {payment.paidAt
                                            ? formatLocalDateTime(payment.paidAt)
                                            : <span className="text-slate-300">—</span>
                                        }
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </article>
    );
}
