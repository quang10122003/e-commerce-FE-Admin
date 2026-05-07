import { getApiErrorMessage } from "@/lib/util/apiError";
import DashboardPage from "./DashboardPage";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { AdminOverviewResponse } from "@/types/overview";
const ADMIN_OVERVIEW_URL = "/admin/overview"

// init data 
async function getAdminOverview() {
  try {
    const payload =
      await serverPrivateFetch<AdminOverviewResponse>(ADMIN_OVERVIEW_URL);

    return {
      data: payload.data,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error: getApiErrorMessage(e, "Không thể tải dữ liệu tổng quan."),
    };
  }
}


export default async function PageDashboard() {
  const { data , error } = await getAdminOverview();
  return (
    <>
      <DashboardPage data={data} error={error}/>
    </>
  )
}