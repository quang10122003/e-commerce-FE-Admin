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
}

export interface AdminRevenueOverview {
    weeklyRevenue: number;
    weeklyRevenueGrowthRate: number;
    adminRevenueIn7day: AdminRevenueIn7day[];
}

export interface AdminRevenueIn7day {
    revenueInDay: number;
    createdAt: string; // LocalDateTime
}