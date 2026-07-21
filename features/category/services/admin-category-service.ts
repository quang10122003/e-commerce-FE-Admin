import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { rethrowSettledNextFrameworkErrors } from "@/server/next-framework-error";
import type {
  AdminCategoryOverviewResponse,
  CategorySummaryResponse,
} from "@/types/categories";

const CATEGORIES_URL = "/admin/categorie";
const CATEGORIES_OVERVIEW_URL = "/admin/categories/overview";

export type AdminCategoriesInitialData = {
  categories: CategorySummaryResponse[] | null;
  overview: AdminCategoryOverviewResponse | null;
};

export type AdminCategoriesInitialError = {
  errorCategory: string | null;
  errorOverview: string | null;
};

type AdminCategoriesInitialResult = {
  data: AdminCategoriesInitialData;
  error: AdminCategoriesInitialError;
};

// Gọi song song API danh mục và overview để khởi tạo trang categories.
export async function getAdminCategoriesInitialData(
  refreshRedirectPath?: string,
): Promise<AdminCategoriesInitialResult> {
  const [categoryResult, overviewResult] = await Promise.allSettled([
    serverPrivateFetch<CategorySummaryResponse[]>(CATEGORIES_URL, {
      refreshRedirectPath,
    }),
    serverPrivateFetch<AdminCategoryOverviewResponse>(CATEGORIES_OVERVIEW_URL, {
      refreshRedirectPath,
    }),
  ]);

  rethrowSettledNextFrameworkErrors([categoryResult, overviewResult]);

  return {
    data: {
      categories:
        categoryResult.status === "fulfilled" && categoryResult.value.success
          ? categoryResult.value.data
          : null,
      overview:
        overviewResult.status === "fulfilled" && overviewResult.value.success
          ? overviewResult.value.data
          : null,
    },
    error: {
      errorCategory:
        categoryResult.status === "rejected"
          ? getApiErrorMessage(
              categoryResult.reason,
              "Khong the tai categories.",
            )
          : categoryResult.value.success
            ? null
            : getApiErrorMessage(
                categoryResult.value,
                "Khong the tai categories.",
              ),
      errorOverview:
        overviewResult.status === "rejected"
          ? "_"
          : overviewResult.value.success
            ? null
            : "_",
    },
  };
}
