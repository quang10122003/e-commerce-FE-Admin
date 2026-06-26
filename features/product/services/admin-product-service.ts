import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import {
  buildAdminProductsBackendPath,
  buildAdminProductsQueryParams,
} from "@/server/admin-products";
import { serverPrivateFetch } from "@/server/backend-fetch";
import type { CategorySummaryResponse } from "@/types/categories";
import type { AdminProductListData, AdminProductsFilters } from "@/types/product";
import { RevenueFilters } from "@/types/revenue";

const CATEGORY_API = "admin/categorie";

export type AdminProductInitialData = {
  category: CategorySummaryResponse[] | null;
  product: AdminProductListData | null;
};

export type AdminProductInitialError = {
  errorCategory: string | null;
  errorProduct: string | null;
};

type AdminProductInitialResult = {
  data: AdminProductInitialData;
  error: AdminProductInitialError;
};

// Gọi song song API product và category để khởi tạo list, filter và form.
export async function getAdminProductInitialData(
  filters: AdminProductsFilters,
): Promise<AdminProductInitialResult> {
  const [dataProduct, dataCategory] = await Promise.allSettled([
    serverPrivateFetch<AdminProductListData>(
      buildAdminProductsBackendPath(buildAdminProductsQueryParams(filters)),
    ),
    serverPrivateFetch<CategorySummaryResponse[]>(CATEGORY_API),
  ]);

  return {
    data: {
      product: dataProduct.status === "fulfilled" ? dataProduct.value.data : null,
      category: dataCategory.status === "fulfilled" ? dataCategory.value.data : null,
    },
    error: {
      errorProduct:
        dataProduct.status === "rejected"
          ? getApiErrorMessage(dataProduct.reason, "ko lay dc data san pham")
          : null,
      errorCategory: dataCategory.status === "rejected" ? "_" : null,
    },
  };
}


