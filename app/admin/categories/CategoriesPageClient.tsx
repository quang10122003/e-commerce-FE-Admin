import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { CategoryListCards } from "@/components/admin/categories/CategoryListCards";
import { CategoryQuickList } from "@/components/admin/categories/CategoryQuickList";
import { CategoryStats } from "@/components/admin/categories/CategoryStats";
import { PageHeader } from "@/components/admin/PageHeader";
import { createAdminCategoryViewModel } from "@/features/category/mappers/admin-category-view-model";
import type {
  AdminCategoriesInitialData,
  AdminCategoriesInitialError,
} from "@/features/category/services/admin-category-service";

interface CategoriesPageClientProps {
  data: AdminCategoriesInitialData;
  editingId: number | null;
  error: AdminCategoriesInitialError;
  isCreating: boolean;
}

export default function CategoriesPageClient({
  data,
  editingId,
  error,
  isCreating,
}: CategoriesPageClientProps) {
  const { categories, categoryEdit, formKey, mode, overview } =
    createAdminCategoryViewModel({ data, editingId, isCreating });

  return (
    <section>
      <PageHeader
        actionHref="/admin/categories?create=1"
        actionLabel="Them category"
        description="Quan ly danh muc theo bang categories (name, image, created_at)."
        title="Categories Management"
      />

      <CategoryStats data={overview} error={error.errorOverview} />

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <CategoryListCards
          data={categories}
          editingId={editingId}
          error={error.errorCategory}
        />

        <article className="space-y-5">
          <CategoryForm
            key={formKey}
            categoryEdit={categoryEdit}
            mode={mode}
          />
          <CategoryQuickList data={overview} />
        </article>
      </div>
    </section>
  );
}
