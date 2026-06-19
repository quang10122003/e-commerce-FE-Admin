export type OrderStatus = "PENDING" | "SHIPPING" | "COMPLETED" | "CANCELLED";

export type OrderStatusFilter = OrderStatus | "ALL";

export interface AdminOrderProductItem {
  id: number;
  productId: number | null;
  name: string;
  category: string | null;
  quantity: number;
  price: number;
  thumbnail: string | null;
}

export interface AdminOrderItem {
  id: number;
  orderCode: string;
  userId: number | null;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  items: AdminOrderProductItem[];
}

export interface AdminOrdersResponse {
  total: number;
  today: number;
  pending: number;
  shipping: number;
  completed: number;
  cancelled: number;
  deliverySuccessRate: number;
  item: AdminOrderItem[];
}

export interface AdminOrdersFilters {
  search: string;
  statusFilter: OrderStatusFilter;
  from: string;
  to: string;
}

export interface AdminOrdersQueryParams {
  search?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
}

export interface AdminOrdersSearchParams {
  search?: string | string[];
  status?: string | string[];
  from?: string | string[];
  to?: string | string[];
}
