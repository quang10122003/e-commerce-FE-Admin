
import { CategoryListCards } from "@/components/admin/categories/CategoryListCards";
import { CategoryFormEdit } from "@/components/admin/categories/CategoryFormEdit";
import { CategoryQuickList } from "@/components/admin/categories/CategoryQuickList";
import { CategoryStats } from "@/components/admin/categories/CategoryStats";
import { Category } from "@/components/admin/categories/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { CategorySummaryResponse } from "@/types/categories";
interface CategoriesPageClientProps{
    categories:Category[]
    data: CategorySummaryResponse[] | null;
    error:string | null
    editingId: number | null
}

export default function CategoriesPageClient({ categories, data, error, editingId }: CategoriesPageClientProps) {
    // data của danh mục đc edit
    const categoriesEdit = data?.find((categorie)=> categorie.id == editingId) ?? null
  return (
    <>
          <section>
              <PageHeader
                  actionHref="#"
                  actionLabel="Them category"
                  description="Quan ly danh muc theo bang categories (name, image, created_at)."
                  title="Categories Management"
              />

              <CategoryStats />

              <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
                  <CategoryListCards data={data} error={error} editingId={editingId} />

                  <article className="space-y-5">
                      <CategoryFormEdit key={categoriesEdit?.id}  categoriesEdit={categoriesEdit} />
                      <CategoryQuickList categories={categories} />
                  </article>
              </div>
          </section>
    </>
  )
}