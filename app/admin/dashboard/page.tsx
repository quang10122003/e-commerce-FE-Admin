import DashboardPage from "./DashboardPage";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { serverPrivateFetch } from "@/server/backend-fetch";
import type { AdminOverviewResponse } from "@/types/overview";

const ADMIN_OVERVIEW_URL = "/admin/overview";

async function getAdminOverview() {
  try {
    const payload =
      await serverPrivateFetch<AdminOverviewResponse>(ADMIN_OVERVIEW_URL);

    if (!payload.success) {
      return {
        data: null,
        error: getApiErrorMessage(payload, "Khong the tai du lieu tong quan."),
      };
    }

    return {
      data: payload.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getApiErrorMessage(error, "Khong the tai du lieu tong quan."),
    };
  }
}

export default async function PageDashboard() {
  const { data, error } = await getAdminOverview();

  return <DashboardPage data={data} error={error} />;
}
