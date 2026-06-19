export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "PAID_LATE";

export type PaymentStatusFilter = PaymentStatus | "ALL";

export interface AdminPaymentsResponse {
    total: number;
    pending: number;
    paid: number;
    failed: number;
    paidLate: number;

    item: AdminPaymentItem[];
}

export interface AdminPaymentItem {
    id: number;
    orderCode: string;
    method: string;         
    status: PaymentStatus;
    transactionRef: string;
    paidAt: string | null;
}

export interface AdminPaymentsFilters {
    search: string;
    statusFilter: PaymentStatusFilter;
    from: string;
    to: string;
}

export interface AdminPaymentsQueryParams {
    search?: string;
    status?: PaymentStatus;
    from?: string;
    to?: string;
}

export interface AdminPaymentsSearchParams {
    search?: string | string[];
    status?: string | string[];
    from?: string | string[];
    to?: string | string[];
}