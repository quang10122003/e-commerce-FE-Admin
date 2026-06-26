export type PeriodType = "WEEK" | "MONTH" | "YEAR";

// Thông tin xác định duy nhất một kỳ (tuần/tháng/năm)
export type RevenueFilters = {
  type: PeriodType;
  year: number;
  week: number  ;   // chỉ có ý nghĩa khi type === "week"
  month: number;  // chỉ có ý nghĩa khi type === "month"
};

export interface RevenueQueryParams {
  type: PeriodType;
  year: number;
  week: number | null ;   
  month: number | null;  
}

// Cấu trúc dữ liệu doanh thu trả về từ API 
export type RevenuePeriodData = {
  kpis: {
    totalRevenue: { value: number; deltaPct: number | null;  };
    pending: { value: number; deltaPct: number |null;  };
  };
  trendSeries: { label: string; revenue: number }[];
  comparisonSeries: { label: string; current: number; previous: number }[];
};