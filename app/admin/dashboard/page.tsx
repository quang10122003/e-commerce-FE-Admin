import DashboardPage from "./DashboardPage";
import { getAdminOverview } from "@/features/dashboard/services/admin-dashboard-service";

export default async function PageDashboard() {
  const { data, error } = await getAdminOverview();

  return <DashboardPage data={data} error={error} />;
}
