import { Tag } from "lucide-react";
import type { Category } from "./types";

type CategoryQuickListProps = {
  categories: Category[];
};

export function CategoryQuickList({ categories }: CategoryQuickListProps) {
  return (
    <div className="panel">
      <h2 className="text-lg font-semibold text-slate-900">Bang nhanh</h2>
      <div className="mt-3 space-y-2">
        {categories.map((category) => (
          <div
            className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
            key={`quick-${category.id}`}
          >
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{category.name}</span>
            </div>
            <span className="text-xs text-slate-500">{category.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
