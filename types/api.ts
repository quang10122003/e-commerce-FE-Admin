export interface ApiError {
  errorCode: string;
  message: string;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData | null;
  error: ApiError | null;
  timestamp: string;
}

export interface PagedResponse<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
