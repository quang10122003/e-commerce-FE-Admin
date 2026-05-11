import CategoriesPageClient from "./CategoriesPageClient";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { serverPrivateFetch } from "@/server/backend-fetch";
import type {
  AdminCategoryOverviewResponse,
  CategorySummaryResponse,
} from "@/types/categories";
import type { NextSearchParams } from "@/types/next";

const CATEGORIES_URL = "/admin/categorie";
const CATEGORIES_OVERVIEW_URL = "/admin/categories/overview";

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function getInitData() {
  const [categoryResult, overviewResult] = await Promise.allSettled([
    serverPrivateFetch<CategorySummaryResponse[]>(CATEGORIES_URL),
    serverPrivateFetch<AdminCategoryOverviewResponse>(CATEGORIES_OVERVIEW_URL),
  ]);

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

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const { data, error } = await getInitData();
  const editingId = Number(getParamValue(params.edit)) || null;
  const isCreating = getParamValue(params.create) === "1";

  return (
    <CategoriesPageClient
      data={data}
      editingId={editingId}
      error={error}
      isCreating={isCreating}
    />
  );
}
