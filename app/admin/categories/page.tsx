import CategoriesPageClient from "./CategoriesPageClient";
import { getAdminCategoriesInitialData } from "@/features/category/services/admin-category-service";
import { readSearchParam } from "@/lib/util/readSearchParam";
import { buildPathWithSearchParams } from "@/server/auth-refresh-redirect";
import type { NextSearchParams } from "@/types/next";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const refreshRedirectPath = buildPathWithSearchParams("/admin/categories", params);

  const { data, error } =
    await getAdminCategoriesInitialData(refreshRedirectPath);
  const editingId = Number(readSearchParam(params.edit)) || null;
  const isCreating = readSearchParam(params.create) === "1";

  return (
    <CategoriesPageClient
      data={data}
      editingId={editingId}
      error={error}
      isCreating={isCreating}
    />
  );
}
