import { Boxes, ImageIcon, Layers3, Tag } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";

const categories = [
  {
    id: 1,
    name: "Dien thoai",
    image: "/images/categories/phone.jpg",
    products: 46,
    createdAt: "2026-03-01",
  },
  {
    id: 2,
    name: "Laptop",
    image: "/images/categories/laptop.jpg",
    products: 35,
    createdAt: "2026-03-03",
  },
  {
    id: 3,
    name: "Phu kien",
    image: "/images/categories/accessories.jpg",
    products: 87,
    createdAt: "2026-03-05",
  },
  {
    id: 4,
    name: "Gia dung",
    image: "/images/categories/home.jpg",
    products: 22,
    createdAt: "2026-03-07",
  },
];

export default function CategoriesPage() {
  return (
    <section>
      <PageHeader
        actionHref="#"
        actionLabel="Them category"
        description="Quan ly danh muc theo bang categories (name, image, created_at)."
        title="Categories Management"
      />

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

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Category cards</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-4"
                key={category.id}
              >
                <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-500">
                  <ImageIcon className="size-8" />
                </div>
                <p className="font-semibold text-slate-900">{category.name}</p>
                <p className="mt-1 text-sm text-slate-500">{category.image}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="chip chip-primary">{category.products} products</span>
                  <button
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                    type="button"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-5">
          <div className="panel">
            <h2 className="text-lg font-semibold text-slate-900">Them category moi</h2>
            <form className="mt-4 space-y-3">
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-slate-700">Ten danh muc</span>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                  placeholder="Vi du: Gaming Gear"
                  type="text"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium text-slate-700">Image URL</span>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                  placeholder="/images/categories/gaming.jpg"
                  type="text"
                />
              </label>
              <button
                className="w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                type="button"
              >
                Luu category
              </button>
            </form>
          </div>

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
        </article>
      </div>
    </section>
  );
}
