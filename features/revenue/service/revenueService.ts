// services/revenueService.ts
import { RevenueFilters, RevenuePeriodData } from "@/types/revenue";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { buildRevenueBackendPath, buildRevenueQueryParams } from "@/server/admin-revenue";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { rethrowNextFrameworkError } from "@/server/next-framework-error";
type RevenuePeriodResult = {
    data: RevenuePeriodData | null;
    error: string | null;
};

export async function fetchRevenueData(
    filter: RevenueFilters,
    refreshRedirectPath?: string,
): Promise<RevenuePeriodResult> {
    try {
        const result = await serverPrivateFetch<RevenuePeriodData>(
            buildRevenueBackendPath(buildRevenueQueryParams(filter)),
            { refreshRedirectPath },
        );
        return {
            data: result.data,  
            error: null,
        };
    } catch (error) {
        rethrowNextFrameworkError(error);

        return {
            data: null,
            error: getApiErrorMessage(error, "Không thể tải data"),
        };
    }
}
