import { ACCESS_TOKEN_COOKIE_KEY } from "@/lib/auth/constants";
import { getApiErrorMessage } from "@/lib/axios/error";
import { serverFetch } from "@/lib/fetch/server-fetch";
import { ApiResponseType } from "@/types/apiRepone/apiType";
import roleType from "@/types/role/role";
import { cookies } from "next/headers";

const PATH_GET_ROLE = "/admin/roles"

// lấy danh sách role fetch trục tiếp từ server next lên backend 
export async function getRoleUser() {
    const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  const payload = await serverFetch<ApiResponseType<roleType[]>>(
    PATH_GET_ROLE,
    {
      accessToken,
      cache: "no-store",
    },
  );

  if (!payload.success || !payload.data) {
    throw new Error(getApiErrorMessage(payload, "Khong the lay danh sach user"));
  }

  return payload.data;
}
