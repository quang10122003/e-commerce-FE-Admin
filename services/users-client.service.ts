"use client";

import { createBffPrivateApiClient } from "@/lib/axios/bff-private";
import type { ApiResponseType } from "@/types/apiRepone/apiType";
import type { ToggleUserLockData } from "@/types/user/User";

const privateBffClient = createBffPrivateApiClient({
  baseURL: "/api/private",
});

export async function updateUserLockStatus(userId: number, locked: boolean) {
  const response = await privateBffClient.patch<ApiResponseType<ToggleUserLockData>>(
    `/admin/users/${userId}/lock`,
    { locked },
  );

  return response.data;
}

// hàm gọi api xóa user của client
export async function deleteUser(userId:number) {
  const respone = await privateBffClient.delete<ApiResponseType<null>>(
    `/admin/users/${userId}`
  )
  return respone.data
}

// export async function updateUser(userId:number) {
//   const respone = await privateBffClient.patch(<)
// }