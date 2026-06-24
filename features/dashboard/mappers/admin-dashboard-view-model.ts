import type { AdminOverviewResponse } from "@/types/overview";

const DAY_IN_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type AdminRevenueBarItem = {
  createdAt: string;
  dayLabel: string;
  revenueInDay: number;
  widthPercent: number;
};

export type AdminDashboardViewModel = {
  latestOrders: AdminOverviewResponse["adminOrderOverview"]["adminNewOrderOverview"];
  orderOverview: AdminOverviewResponse["adminOrderOverview"];
  productOverview: AdminOverviewResponse["adminProductOverview"];
  revenueBars: AdminRevenueBarItem[];
  revenueOverview: AdminOverviewResponse["adminRevenueOverview"];
  userOverview: AdminOverviewResponse["adminUserOverview"];
};

// Tạo dữ liệu dashboard đã tính sẵn như bar width và danh sách order mới nhất.
export function createAdminDashboardViewModel(
  data: AdminOverviewResponse,
): AdminDashboardViewModel {
  const revenueOverview = data.adminRevenueOverview;
  const revenues = revenueOverview.adminRevenueIn7day.map(
    (item) => item.revenueInDay,
  );
  const maxRevenue = Math.max(...revenues, 0);

  return {
    latestOrders: data.adminOrderOverview.adminNewOrderOverview,
    orderOverview: data.adminOrderOverview,
    productOverview: data.adminProductOverview,
    revenueBars: revenueOverview.adminRevenueIn7day.map((item, index) => ({
      createdAt: item.createdAt,
      dayLabel: DAY_IN_WEEK[index],
      revenueInDay: item.revenueInDay,
      widthPercent:
        maxRevenue > 0 ? Math.round((item.revenueInDay / maxRevenue) * 100) : 0,
    })),
    revenueOverview,
    userOverview: data.adminUserOverview,
  };
}
