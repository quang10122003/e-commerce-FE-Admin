import { Boxes, Layers3, PackageX } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { AdminCategoryOverviewResponse } from "@/types/categories";
type CategoryStats={
  data:AdminCategoryOverviewResponse |null
  error: string | null
}
export function CategoryStats({ data, error }: CategoryStats ) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        icon={<Boxes className="size-5" />}
        note="Tong danh muc hien co"
        title="Tong categories"
        value={data ? String(data.totalCategory) : (error ?? "_")}
      />
      <StatCard
        icon={<Layers3 className="size-5" />}
        note="Category co nhieu product nhat"
        title="Top category"
        tone="emerald"
        value={data ? String(data.topCategory) : (error ?? "_")}
      />
      <StatCard
        icon={<PackageX className="size-5" />}
        note="Category chua co product"
        title="Empty categories"
        tone="violet"
        value={data ? String(data.emptyCategories) : (error ?? "_")}
      />
    </div>
  );
}
