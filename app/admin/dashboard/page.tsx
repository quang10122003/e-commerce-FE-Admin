import DashboardPage from "./DashboardPage";
import { getAdminOverview } from "@/features/dashboard/services/admin-dashboard-service";

export default async function PageDashboard() {
  const refreshRedirectPath = "/admin/dashboard";

  const { data, error } = await getAdminOverview(refreshRedirectPath);

  return <DashboardPage data={data} error={error} />;
}
