"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { AdminPaymentItem, PaymentStatus } from "@/types/payment";
import { formatLocalDateTime } from "@/lib/util/formatDateTime";

// ─── Badge helpers ────────────────────────────────────────────────────────────

/** Trả về CSS class của chip tương ứng với trạng thái thanh toán. */
function statusChipClass(status: PaymentStatus): string {
    switch (status) {
        case "PAID": return "chip chip-success";
        case "PAID_LATE": return "chip chip-paid-late";
        case "PENDING": return "chip chip-warning";
        case "FAILED": return "chip chip-danger";
    }
}

/** Trả về nhãn hiển thị cho từng trạng thái thanh toán. */
function statusLabel(status: PaymentStatus): string {
    switch (status) {
        case "PAID": return "Paid";
        case "PAID_LATE": return "Paid late";
        case "PENDING": return "Pending";
        case "FAILED": return "Failed";
    }
}

/**
 * Trả về CSS class của chip cho phương thức thanh toán.
 * method là string tự do — fallback về chip-primary nếu không khớp.
 */
function methodChipClass(method: string): string {
    switch (method) {
        case "SEPAY": return "chip chip-primary";
        case "COD": return "chip chip-warning";
        default: return "chip chip-primary";
    }
}

// ─── Trạng thái lỗi ──────────────────────────────────────────────────────────

/** Hiển thị hàng lỗi toàn bảng khi fetch thất bại. */
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

// ─── Trạng thái rỗng ─────────────────────────────────────────────────────────

/** Hiển thị hàng thông báo khi không có giao dịch nào khớp filter. */
function TableEmpty() {
    return (
        <tr>
            <td colSpan={6} className="py-10 text-center text-sm text-slate-400">
                Không tìm thấy giao dịch phù hợp.
            </td>
        </tr>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PaymentTableProps {
    /** Danh sách giao dịch từ server, null nếu fetch thất bại. */
    payments: AdminPaymentItem[] | null;
    /** Thông báo lỗi từ server, hiển thị trực tiếp lên bảng nếu có. */
    error: string | null;
}

// ─── Component chính ─────────────────────────────────────────────────────────

export function PaymentTable({ payments, error }: PaymentTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /*
     * SOURCE OF TRUTH: URL search params.
     * Các state dưới đây chỉ là bản nháp tạm thời cho UI input —
     * được khởi tạo từ URL và chỉ được apply lên URL khi nhấn Apply.
     * Mọi thay đổi URL (kể cả paste URL trực tiếp) sẽ luôn được phản ánh
     * đúng vì useState() chạy lại mỗi khi component mount với URL mới.
     */
    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [status, setStatus] = useState(searchParams.get("status") ?? "");
    const [from, setFrom] = useState(searchParams.get("from") ?? "");
    const [to, setTo] = useState(searchParams.get("to") ?? "");

    /**
     * Apply filter: ghi các giá trị nháp lên URL.
     * Next.js re-render server component → fetch lại API với filter mới.
     * Chỉ set param nếu có giá trị, tránh query string thừa.
     */
    const handleApply = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        router.push(`${pathname}?${params.toString()}`,{scroll:false});
    };

    /**
     * Reset filter: xoá state nháp và đưa URL về pathname gốc (không có params).
     */
    const handleReset = () => {
        setSearch(""); setStatus(""); setFrom(""); setTo("");
        router.push(pathname,{ scroll: false });
    };

    const rows = payments ?? [];

    return (
        <article className="panel overflow-hidden">
            {/* ── Tiêu đề & Bộ lọc ── */}
            <div className="flex flex-col gap-4">
                <h2 className="section-title">Danh sách giao dịch</h2>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Tìm kiếm theo transaction ref */}
                    <input
                        type="text"
                        placeholder="Transaction ref..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="field-input field-inline w-full sm:w-52"
                    />

                    {/* Lọc theo trạng thái thanh toán */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="field-select w-full sm:w-36"
                    >
                        <option value="">All status</option>
                        <option value="PAID">Paid</option>
                        <option value="PAID_LATE">Paid late</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>

                    {/* Lọc theo khoảng ngày thanh toán */}
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="field-input field-inline w-full sm:w-36"
                        />
                        <span className="text-slate-400 text-sm">–</span>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="field-input field-inline w-full sm:w-36"
                        />
                    </div>

                    {/* Nút Apply và Reset */}
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <button type="button" onClick={handleApply} className="btn-primary">
                            Apply
                        </button>
                        <button type="button" onClick={handleReset} className="btn-outline !px-4 !py-2.5 !text-sm !rounded-xl">
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bảng dữ liệu ── */}
            <div className="mt-5 w-full overflow-auto max-h-[400px] rounded-lg border border-slate-100 scrollbar-glass">
                <table className="w-full min-w-[640px] text-left text-sm border-collapse">
                    <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_rgba(226,232,240,1)]">
                        <tr className="text-slate-500">
                            <th className="py-3 px-4 font-medium">Payment ID</th>
                            <th className="py-3 px-4 font-medium">Order code</th>
                            <th className="py-3 px-4 font-medium">Method</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">Transaction ref</th>
                            <th className="py-3 px-4 font-medium">Paid at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Ưu tiên hiển thị lỗi trước, sau đó mới kiểm tra dữ liệu rỗng */}
                        {error ? (
                            <TableError message={error} />
                        ) : rows.length === 0 ? (
                            <TableEmpty />
                        ) : (
                            rows.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                                >
                                    <td className="py-3 px-4 font-semibold text-slate-800">#{p.id}</td>
                                    <td className="py-3 px-4 text-slate-700">{p.orderCode}</td>
                                    <td className="py-3 px-4">
                                        <span className={methodChipClass(p.method)}>{p.method}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={statusChipClass(p.status)}>{statusLabel(p.status)}</span>
                                    </td>
                                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{p.transactionRef}</td>
                                    <td className="py-3 px-4 text-slate-600">
                                        {p.paidAt
                                            ? formatLocalDateTime(p.paidAt)
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