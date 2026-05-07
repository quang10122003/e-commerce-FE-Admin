import { Boxes, ImageIcon, Layers3 } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

export function CategoryStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        icon={<Boxes className="size-5" />}
        note="Tong danh muc hien co"
        title="Tong categories"
        value="12"
      />
      <StatCard
        icon={<Layers3 className="size-5" />}
        note="Category co nhieu product nhat"
        title="Top category"
        tone="emerald"
        value="Phu kien"
      />
      <StatCard
        icon={<ImageIcon className="size-5" />}
        note="Image URL da mapping day du"
        title="Image quality"
        tone="violet"
        value="100%"
      />
    </div>
  );
}
