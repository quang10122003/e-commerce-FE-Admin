import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Product } from "./types";

type ProductsTableProps = {
  products: Product[];
};

export function ProductsTable({ products }: ProductsTableProps) {
  return (
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
                <StatusBadge tone={item.stock > 0 ? "success" : "danger"}>{item.stock}</StatusBadge>
              </td>
              <td className="py-3">{item.purchases}</td>
              <td className="py-3">
                <StatusBadge tone={item.status === "ACTIVE" ? "success" : "warning"}>
                  {item.status}
                </StatusBadge>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <button className="btn-outline" type="button">
                    Edit
                  </button>
                  <button className="btn-outline-danger" type="button">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
