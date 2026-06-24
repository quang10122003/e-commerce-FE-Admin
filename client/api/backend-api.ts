"use client";

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginRequest } from "@/types/auth";
import type { CategorySummaryResponse } from "@/types/categories";
import type {
  AdminOrderItem,
  UpdateAdminOrderStatusRequest,
} from "@/types/order";
import type {
  AdminCreateProductRequest,
  AdminProductStatusRequest,
  AdminProductStatusResponse,
  AdminProductSummaryResponse,
  AdminUpdateProductRequest,
} from "@/types/product";
import type {
  ToggleUserLockData,
  ToggleUserLockRequest,
  UpdateUserRequest,
  UpdateUserResponse,
} from "@/types/users";
import type { ChatMessage, ChatRoom, WsTicketResponse } from "@/types/chat";

// Gửi API client qua proxy backend của Next và kèm cookie httpOnly.
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/backend",
  credentials: "include",
  prepareHeaders: (headers) => {
    // Browser chỉ gọi Next API proxy; token thật nằm trong cookie httpOnly.
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    return headers;
  },
});

// Nhận diện envelope lỗi ngay cả khi HTTP status vẫn là 2xx.
function isFailedApiResponse(data: unknown) {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as { success?: unknown }).success === false
  );
}

// Điều hướng về login theo flow admin khi private API vẫn mất auth sau proxy retry.
function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  const nextPath = `${window.location.pathname}${window.location.search}`;
  const loginUrl = new URL("/login", window.location.origin);

  loginUrl.searchParams.set("next", nextPath);
  window.location.replace(loginUrl.toString());
}

// Chuẩn hóa lỗi proxy và xóa cache RTK Query khi session không còn hợp lệ.
const backendBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if ("data" in result && isFailedApiResponse(result.data)) {
    return {
      error: {
        data: result.data,
        error: "Request failed.",
        status: "CUSTOM_ERROR",
      },
    };
  }

  if (result.error?.status === 401) {
    // Xóa cache cũ để UI admin không hiển thị dữ liệu stale sau khi hết phiên.
    api.dispatch(backendApi.util.resetApiState());

    if (api.endpoint !== "login" && api.endpoint !== "logout") {
      redirectToLogin();
    }
  }

  return result;
};

export const backendApi = createApi({
  baseQuery: backendBaseQuery,
  endpoints: (builder) => ({
    deleteAdminUser: builder.mutation<ApiResponse<null>, number>({
      invalidatesTags: [{ id: "LIST", type: "AdminUsers" }],
      query: (userId) => ({
        method: "DELETE",
        url: `/admin/users/${userId}`,
      }),
    }),
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      invalidatesTags: ["Auth"],
      query: (body) => ({
        body,
        method: "POST",
        url: "/auth/login",
      }),
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
      invalidatesTags: ["Auth", "AdminUsers"],
      query: () => ({
        method: "POST",
        url: "/auth/logout",
      }),
    }),
    createWsTicket: builder.mutation<WsTicketResponse, void>({
      query: () => ({
        method: "POST",
        url: "/ws-ticket",
      }),
    }),
    markChatRoomAsRead: builder.mutation<ApiResponse<ChatRoom>, number>({
      invalidatesTags: ["AdminChatRooms"],
      query: (roomId) => ({
        method: "POST",
        url: `/chat/rooms/${roomId}/read`,
      }),
    }),
    getChatRoomMessages: builder.query<ApiResponse<ChatMessage[]>, number>({
      query: (roomId) => ({
        method: "GET",
        url: `/chat/rooms/${roomId}/messages`,
      }),
    }),
    updateAdminUser: builder.mutation<
      ApiResponse<UpdateUserResponse>,
      { data: UpdateUserRequest; userId: number }
    >({
      invalidatesTags: [{ id: "LIST", type: "AdminUsers" }],
      query: ({ data, userId }) => ({
        body: data,
        method: "PATCH",
        url: `/admin/users/${userId}`,
      }),
    }),
    updateAdminUserLock: builder.mutation<
      ApiResponse<ToggleUserLockData>,
      { data: ToggleUserLockRequest; userId: number }
    >({
      invalidatesTags: [{ id: "LIST", type: "AdminUsers" }],
      query: ({ data, userId }) => ({
        body: data,
        method: "PATCH",
        url: `/admin/users/${userId}/lock`,
      }),
    }),
    updateCategory: builder.mutation<
      ApiResponse<CategorySummaryResponse>,
      { categoryId: number; name: string; file?: File | null }
    >({
      invalidatesTags: [{ id: "LIST", type: "AdminCategories" }],
      query: ({ categoryId, name, file }) => {
        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify({ name })], { type: "application/json" }),
        );

        if (file) {
          formData.append("file", file);
        }

        return {
          body: formData,
          method: "PATCH",
          url: `/admin/categori/${categoryId}`,
        };
      },
    }),
    createCategory: builder.mutation<
      ApiResponse<CategorySummaryResponse>,
      { name: string; file: File }
    >({
      invalidatesTags: [{ id: "LIST", type: "AdminCategories" }],
      query: ({ name, file }) => {
        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify({ name:name })], { type: "application/json" }),
        );
        formData.append("file", file);

        return {
          body: formData,
          method: "POST",
          url: "/admin/categori",
        };
      },
    }),
    deleteCategory: builder.mutation<ApiResponse<void>, number>({
      invalidatesTags: [{ id: "LIST", type: "AdminCategories" }],
      query: (categoryId) => ({
        method: "DELETE",
        url: `/admin/categori/${categoryId}`,
      }),
    }),
    createProduct: builder.mutation<
      ApiResponse<AdminProductSummaryResponse>,
      AdminCreateProductRequest
    >({
      invalidatesTags: [{ id: "LIST", type: "AdminProducts" }],
      query: ({ thumbnail, images, ...data }) => {
        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" }),
        );
        formData.append("thumbnail", thumbnail);

        Array.from(images ?? []).forEach((image) => {
          formData.append("images", image);
        });

        return {
          body: formData,
          method: "POST",
          url: "/admin/products",
        };
      },
    }),
    updateProduct: builder.mutation<
      ApiResponse<AdminProductSummaryResponse>,
      AdminUpdateProductRequest
    >({
      invalidatesTags: [{ id: "LIST", type: "AdminProducts" }],
      query: ({ productId, thumbnail, images, deleteImageUrls, ...data }) => {
        const formData = new FormData();

        // Backend dùng @ModelAttribute, nên các field text phải append trực tiếp thay vì gói vào Blob JSON.
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, String(value));
        });

        if (thumbnail) {
          formData.append("thumbnail", thumbnail);
        }

        Array.from(images ?? []).forEach((image) => {
          formData.append("images", image);
        });

        // Gửi lặp cùng key để Spring bind thành List<String> deleteImageUrls.
        deleteImageUrls?.forEach((url) => {
          formData.append("deleteImageUrls", url);
        });

        return {
          body: formData,
          method: "PUT",
          url: `/admin/products/${productId}`,
        };
      },
    }),
    deleteProduct: builder.mutation<
    ApiResponse<void>,
    number
    >({
      query: (productId)=>(
        {
          method:"DELETE",
          url:`./admin/products/${productId}`
        }
      )
    }),
    updateStatusProduct: builder.mutation<
      ApiResponse<AdminProductStatusResponse>,
    AdminProductStatusRequest
    >({
      query: ({ productId, status })=>(
        {
          url: `/admin/products/${productId}/status`,
          body:{status},
          method:"PATCH"
        }
      )
    }),
    updateAdminOrderStatus: builder.mutation<
      ApiResponse<AdminOrderItem>,
      UpdateAdminOrderStatusRequest
    >({
      invalidatesTags: [{ id: "LIST", type: "AdminOrders" }],
      query: ({ orderId, status }) => ({
        method: "POST",
        url: `/admin/orders/${orderId}/${status}`,
      }),
    })
  }),
  reducerPath: "backendApi",
  tagTypes: ["AdminCategories", "AdminProducts", "AdminUsers", "AdminOrders", "AdminChatRooms", "Auth"],
});

export const {
  useCreateCategoryMutation,
  useCreateProductMutation,
  useCreateWsTicketMutation,
  useDeleteCategoryMutation,
  useDeleteAdminUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useLazyGetChatRoomMessagesQuery,
  useMarkChatRoomAsReadMutation,
  useUpdateAdminUserLockMutation,
  useUpdateAdminUserMutation,
  useUpdateCategoryMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateAdminOrderStatusMutation,
  useUpdateStatusProductMutation
} = backendApi;
