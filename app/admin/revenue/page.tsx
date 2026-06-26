
import { fetchRevenueData } from "@/features/revenue/service/revenueService";
import { parseRevenueFilters } from "@/server/admin-revenue";
import { NextSearchParams } from "@/types/next";
import { RevenueClient } from "./RevenueClient";

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const filters = parseRevenueFilters(params);
  const {data,error} = await fetchRevenueData(filters);
  console.log(data)
  console.log(error)

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <RevenueClient filters={filters} data={data} error={error} />
    </main>
  );
}