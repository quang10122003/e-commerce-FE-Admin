import { Tag } from "lucide-react";
import { AdminCategoryOverviewResponse } from "@/types/categories";
import { formatLocalDate } from "@/lib/util/formatDateTime";

type CategoryQuickListProps = {
  data: AdminCategoryOverviewResponse | null
};

export function CategoryQuickList({ data }: CategoryQuickListProps) {
  const categories = data?.listNewCategory;
  return (
    <div className="panel">
      <h2 className="text-lg font-semibold text-slate-900">Bang nhanh</h2>
      <div className="mt-3 space-y-2">
        {categories ?(
          categories.map((category) => (
            <div
              className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
              key={`quick-${category.name}`}
            >
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{category.name}</span>
              </div>
              <span className="text-xs text-slate-500">{formatLocalDate(category.createdAt)}</span>
            </div>
          ))
        ):(
            <div className="flex h-32 w-full items-center justify-center text-error">
              Lỗi ko tải đc data
            </div>
        )}
      </div>
    </div>
  );
}
