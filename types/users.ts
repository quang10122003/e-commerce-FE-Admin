import type { PagedResponse } from "@/types/api";

export const ADMIN_USERS_PAGE_SIZE = 10;

export type UserRole = "ADMIN" | "USER" | (string & {});
export type UserStatus = "ACTIVE" | "LOCKED" | (string & {});

export interface UserItem {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  locked: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  lockedUsers: number;
}

export interface UserListData {
  users: PagedResponse<UserItem>;
  stats: UserStats;
}

export interface AdminUsersFilters {
  currentPage: number;
  roleFilter: string;
  search: string;
  statusFilter: string;
}

export interface AdminUsersQueryParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface ToggleUserLockRequest {
  locked: boolean;
}

export interface ToggleUserLockData {
  userId: number;
  locked: boolean;
  status: UserStatus;
}

export interface UpdateUserRequest {
  email: string;
  fullName: string;
  role: string;
}

export interface UpdateUserResponse {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AdminUsersSearchParams {
  page?: string | string[];
  role?: string | string[];
  search?: string | string[];
  status?: string | string[];
};