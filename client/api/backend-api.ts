"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginRequest } from "@/types/auth";
import type { CategorySummaryResponse } from "@/types/categories";
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
import type { ChatRoom, WsTicketResponse } from "@/types/chat";

export const backendApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/backend",
    credentials: "include",
    prepareHeaders: (headers) => {
      // Browser only calls the Next API proxy; the real token stays in the httpOnly cookie.
      if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
      }

      return headers;
    },
  }),
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
    })
  }),
  reducerPath: "backendApi",
  tagTypes: ["AdminCategories", "AdminProducts", "AdminUsers", "AdminChatRooms", "Auth"],
});

export const {
  useCreateCategoryMutation,
  useCreateProductMutation,
  useCreateWsTicketMutation,
  useDeleteCategoryMutation,
  useDeleteAdminUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useMarkChatRoomAsReadMutation,
  useUpdateAdminUserLockMutation,
  useUpdateAdminUserMutation,
  useUpdateCategoryMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStatusProductMutation
} = backendApi;
