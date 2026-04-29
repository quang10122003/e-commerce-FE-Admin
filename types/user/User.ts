import type { PagedResponseType } from "@/types/apiRepone/apiType";

export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "LOCKED";

export interface UserItem {
  id: number;
  fullName: string;
  email: string;
  role: UserRole | string;
  status: UserStatus | string;
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
  users: PagedResponseType<UserItem>;
  stats: UserStats;
}

export interface AdminUsersQueryParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  size?: number;
}
export interface ToggleUserLockData {
  userId: number;
  locked: boolean;
  status: "ACTIVE" | "LOCKED" | string;
}

export interface updateUserRequest{ 
  email: string
  fullName: string
  role: UserRole
}
export interface updateUserRepone {
  id:number
  email: string
  fullName: string
  role: UserRole
}
