export interface AdminOverviewResponse {
    adminUserOverview: AdminUserOverview;
    adminProductOverview: AdminProductOverview;
    adminOrderOverview: AdminOrderOverview;
    adminRevenueOverview: AdminRevenueOverview;
}

export interface AdminUserOverview {
    totalUser: number;
    newUserIn7day: number;
}

export interface AdminProductOverview {
    totalProducts: number;
    productActive: number;
}

export interface AdminOrderOverview {
    todayOrderCount: number;
    pendingOrderCount: number;
    adminNewOrderOverview: AdminNewOrderOverview[]
}

export interface AdminRevenueOverview {
    weeklyRevenue: number; // tông doanh thu 1 tuần
    weeklyRevenueGrowthRate: number; // tỉ lệ tăng trưởng so với tuần trc 
    adminRevenueIn7day: AdminRevenueIn7day[]; // doanh thu của 7 ngày trong tuần
}

export interface AdminRevenueIn7day {
    revenueInDay: number;
    createdAt: string; // LocalDateTime
}

export type PaymentMethod = 'COD' | 'STRIPE' | 'VNPAY';

export type OrderStatus = 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export type AdminNewOrderOverview = {
    id: number;
    createdAt: string;
    shippingName: string;
    totalAmount: number;
    methodPayment: PaymentMethod | null;
    statusOrder: OrderStatus;
};