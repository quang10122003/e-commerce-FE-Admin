"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse, LoginRequest } from "@/types/auth";
import type { Role } from "@/types/roles";
import type {
  AdminUsersQueryParams,
  ToggleUserLockData,
  ToggleUserLockRequest,
  UpdateUserRequest,
  UpdateUserResponse,
  UserListData,
} from "@/types/users";
import type { AdminOverviewResponse } from "@/types/overview";
import type { CategorySummaryResponse } from "@/types/categories";


// bieens đổi từ prams opject qua trong url
function toQueryString(params: AdminUsersQueryParams | void) {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (typeof params.page === "number") {
    searchParams.set("page", params.page.toString());
  }

  if (typeof params.size === "number") {
    searchParams.set("size", params.size.toString());
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export const backendApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/backend",
    credentials: "include",
    prepareHeaders: (headers) => {
      // Browser chỉ gọi Next API proxy; token thật vẫn nằm trong cookie httpOnly.
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
    getAdminRoles: builder.query<ApiResponse<Role[]>, void>({
      providesTags: [{ id: "LIST", type: "AdminRoles" }],
      query: () => "/admin/roles",
    }),
    getAdminUsers: builder.query<ApiResponse<UserListData>, AdminUsersQueryParams>({
      providesTags: [{ id: "LIST", type: "AdminUsers" }],
      query: (params) => `/admin/users${toQueryString(params)}`,
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
      invalidatesTags: ["Auth", "AdminUsers", "AdminRoles"],
      query: () => ({
        method: "POST",
        url: "/auth/logout",
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
    getOrverView: builder.query<ApiResponse<AdminOverviewResponse>, void>({
      query: () => ({
        url: "/admin/overview",
      }),
    }),
    updateCategory: builder.mutation<ApiResponse<CategorySummaryResponse>, { categoryId:number,name:string,file?:File | null}>({
      query: ({categoryId,name,file})=>{
        
        const formData = new FormData()
        formData.append(
          "data", new Blob([JSON.stringify({"name":name})], { type:"application/json"})
        );
        if(file!=null){
          formData.append(
            "file", file
          )
        }
        return {
          url: `/admin/categori/${categoryId}`,
          method: "PATCH",
          body: formData,
          // KHÔNG set headers, để browser tự set Content-Type + boundary
        };
       
      }
    }),
    createCategory: builder.mutation<ApiResponse<CategorySummaryResponse>,{name:string,file:File}>({
      query: ({ name, file })=>{
        const  formData = new FormData()
        formData.append(
          "data", new Blob([JSON.stringify({name:name})],{type:"application/json"})
        )
        
        formData.append(
          "file", file
        )
        return {
          url: "/admin/categori",
          method: "POST",
          body: formData
        }
      }
    })

  }),
  reducerPath: "backendApi",
  tagTypes: ["AdminRoles", "AdminUsers", "Auth"],
});

export const {
  useDeleteAdminUserMutation,
  useGetAdminRolesQuery,
  useGetAdminUsersQuery,
  useLoginMutation,
  useLogoutMutation,
  useUpdateAdminUserLockMutation,
  useUpdateAdminUserMutation,
  useGetOrverViewQuery,
  useUpdateCategoryMutation,
  useCreateCategoryMutation
} = backendApi;
