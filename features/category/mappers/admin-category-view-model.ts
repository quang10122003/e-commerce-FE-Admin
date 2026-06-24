import type { AdminCategoriesInitialData } from "@/features/category/services/admin-category-service";
import type { CategorySummaryResponse } from "@/types/categories";

type CreateAdminCategoryViewModelInput = {
  data: AdminCategoriesInitialData;
  editingId: number | null;
  isCreating: boolean;
};

type CategoryFormMode = "idle" | "create" | "edit";

export type AdminCategoryViewModel = {
  categories: CategorySummaryResponse[] | null;
  categoryEdit: CategorySummaryResponse | null;
  formKey: string | number;
  mode: CategoryFormMode;
  overview: AdminCategoriesInitialData["overview"];
};

// Tạo dữ liệu điều khiển form và danh sách để component categories chỉ render UI.
export function createAdminCategoryViewModel({
  data,
  editingId,
  isCreating,
}: CreateAdminCategoryViewModelInput): AdminCategoryViewModel {
  const categoryEdit =
    data.categories?.find((category) => category.id === editingId) ?? null;
  const mode = isCreating ? "create" : categoryEdit ? "edit" : "idle";

  return {
    categories: data.categories,
    categoryEdit,
    formKey: isCreating ? "create" : categoryEdit?.id ?? "idle",
    mode,
    overview: data.overview,
  };
}
