import { BarChart3, Boxes, ImageIcon, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

const products = [
  {
    id: 101,
    name: "iPhone 16 Pro 256GB",
    category: "Dien thoai",
    price: "31,990,000",
    stock: 12,
    purchases: 214,
    status: "ACTIVE",
  },
  {
    id: 102,
    name: "MacBook Air M4",
    category: "Laptop",
    price: "28,490,000",
    stock: 8,
    purchases: 93,
    status: "ACTIVE",
  },
  {
    id: 103,
    name: "Tai nghe Bluetooth MaxSound",
    category: "Phu kien",
    price: "1,590,000",
    stock: 0,
    purchases: 307,
    status: "INACTIVE",
  },
  {
    id: 104,
    name: "May loc khong khi AirHome",
    category: "Gia dung",
    price: "3,290,000",
    stock: 6,
    purchases: 61,
    status: "ACTIVE",
  },
];

const images = [
  "/images/products/iphone-main.jpg",
  "/images/products/iphone-side.jpg",
  "/images/products/iphone-back.jpg",
];

export default function ProductsPage() {
  return (
    <section>
      <PageHeader
        actionHref="#"
        actionLabel="Them product"
        description="UI quan ly products + product_images theo schema DB."
        title="Products Management"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Boxes className="size-5" />}
          note="Tong so san pham trong DB"
          title="Tong products"
          value="168"
        />
        <StatCard
          icon={<BarChart3 className="size-5" />}
          note="Top selling trong 30 ngay"
          title="Ban chay nhat"
          tone="emerald"
          value="Tai nghe MaxSound"
        />
        <StatCard
          icon={<PackagePlus className="size-5" />}
          note="Con stock > 0 va dang active"
          title="Co the ban"
          tone="blue"
          value="143"
        />
        <StatCard
          icon={<ImageIcon className="size-5" />}
          note="Tong so anh product_images"
          title="Library anh"
          tone="violet"
          value="537"
        />
      </div>

      <article className="panel mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400"
            defaultValue="iphone"
            type="text"
          />
          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
            <option>Tat ca category</option>
            <option>Dien thoai</option>
            <option>Laptop</option>
            <option>Phu kien</option>
          </select>
          <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
            <option>Tat ca status</option>
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 font-medium">ID</th>
                <th className="py-3 font-medium">Name</th>
                <th className="py-3 font-medium">Category</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium">Stock</th>
                <th className="py-3 font-medium">Purchases</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr className="border-b border-slate-100" key={item.id}>
                  <td className="py-3 font-semibold text-slate-800">#{item.id}</td>
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3">{item.price} VND</td>
                  <td className="py-3">
                    <StatusBadge tone={item.stock > 0 ? "success" : "danger"}>
                      {item.stock}
                    </StatusBadge>
                  </td>
                  <td className="py-3">{item.purchases}</td>
                  <td className="py-3">
                    <StatusBadge tone={item.status === "ACTIVE" ? "success" : "warning"}>
                      {item.status}
                    </StatusBadge>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Chi tiet product dang sua</h2>
          <form className="mt-4 grid grid-cols-2 gap-3">
            <label className="col-span-2 space-y-1 text-sm">
              <span className="font-medium text-slate-700">Ten san pham</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                defaultValue="iPhone 16 Pro 256GB"
                type="text"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Gia</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                defaultValue="31990000"
                type="text"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Stock</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                defaultValue="12"
                type="number"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Status</span>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400">
                <option>ACTIVE</option>
                <option>INACTIVE</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-slate-700">Category</span>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400">
                <option>Dien thoai</option>
                <option>Laptop</option>
                <option>Phu kien</option>
              </select>
            </label>
            <label className="col-span-2 space-y-1 text-sm">
              <span className="font-medium text-slate-700">Description</span>
              <textarea
                className="h-24 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                defaultValue="Flagship phone, chip A18, camera tele 5x."
              />
            </label>
          </form>
        </article>

        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Product images</h2>
          <div className="mt-4 space-y-3">
            {images.map((image) => (
              <div
                className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm"
                key={image}
              >
                <span className="truncate pr-3 text-slate-700">{image}</span>
                <button
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <label className="mt-4 block space-y-1 text-sm">
            <span className="font-medium text-slate-700">Them image URL</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="/images/products/iphone-new.jpg"
              type="text"
            />
          </label>
          <button
            className="mt-3 w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            type="button"
          >
            Luu bo anh
          </button>
        </article>
      </div>
    </section>
  );
}
