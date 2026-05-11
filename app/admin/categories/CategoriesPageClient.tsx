
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { CategoryListCards } from "@/components/admin/categories/CategoryListCards";
import { CategoryQuickList } from "@/components/admin/categories/CategoryQuickList";
import { CategoryStats } from "@/components/admin/categories/CategoryStats";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCategoryOverviewResponse, CategorySummaryResponse } from "@/types/categories";
interface CategoriesPageClientProps{
    data: {
        categories: CategorySummaryResponse[] | null;
        overview: AdminCategoryOverviewResponse | null;
    };
    error: {
        errorCategory: string | null;
        errorOverview: string | null;
    };
    editingId: number | null
    isCreating: boolean
}

export default function CategoriesPageClient({ data, error, editingId, isCreating }: CategoriesPageClientProps) {
    // các data và error của các cpn con 
    const categoryData = data.categories;
    const overviewData = data.overview;

    const categoryError = error.errorCategory;
    const overviewError = error.errorOverview;
    // data của danh mục đc edit
    const categoriesEdit = categoryData?.find((categorie)=> categorie.id == editingId) ?? null
// mode của form trong page danh mục
    const mode = isCreating ? "create" : categoriesEdit ? "edit" : "idle";
  return (
    <>
          <section>
              <PageHeader
                  actionHref="/admin/categories?create=1"
                  actionLabel="Them category"
                  description="Quan ly danh muc theo bang categories (name, image, created_at)."
                  title="Categories Management"
              />

              <CategoryStats data={overviewData}
                  error={overviewError} />

              <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
                  <CategoryListCards data={categoryData} error={categoryError} editingId={editingId} />

                  <article className="space-y-5">
                      <CategoryForm
                          key={isCreating ? "create" : categoriesEdit?.id ?? "idle"}
                          mode={mode}
                          categoryEdit={categoriesEdit}
                      />
                      <CategoryQuickList data={overviewData}/>
                  </article>
              </div>
          </section>
    </>
  )
}
