import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import type { AdminProductItem } from "@/types/product";

type ProductsTablePagination = {
  // Trang hien tai va tong so trang lay tu backend.
  currentPage: number;
  // Link prev/next da build san voi filter hien tai.
  nextHref?: string;
  previousHref?: string;
  totalItems: number;
  totalPages: number;
};

type ProductsTableProps = {
  // ID product dang duoc chon de edit, dung de highlight nut Edit trong bang.
  activeProductId?: number | null;
  // Build link edit giu lai filter va page hien tai.
  getEditHref: (productId: number) => string;
  pagination: ProductsTablePagination;
  // Danh sach product dang hien thi trong bang.
  products: AdminProductItem[];
};

// Format gia theo chuan Viet Nam truoc khi hien thi ra UI.
const priceFormatter = new Intl.NumberFormat("vi-VN");

export function ProductsTable({
  activeProductId,
  getEditHref,
  pagination,
  products,
}: ProductsTableProps) {
  return (
    <>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-215 text-left text-sm">
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
            {products.length ? (
              products.map((item) => (
                <tr className="border-b border-slate-100" key={item.id}>
                  <td className="py-3 font-semibold text-slate-800">#{item.id}</td>
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.categoryName}</td>
                  <td className="py-3">
                    {priceFormatter.format(item.price)} VND
                  </td>
                  <td className="py-3">
                    <StatusBadge tone={item.stock > 0 ? "success" : "danger"}>
                      {item.stock}
                    </StatusBadge>
                  </td>
                  <td className="py-3">{item.purchases}</td>
                  <td className="py-3">
                    <StatusBadge
                      tone={item.status === "ACTIVE" ? "success" : "warning"}
                    >
                      {item.status}
                    </StatusBadge>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        className={`btn-outline ${
                          // Product nao dang edit se co mau nhan de biet dang chon dong nao.
                          activeProductId === item.id
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : ""
                        }`}
                        href={getEditHref(item.id)}
                        scroll={false}
                      >
                        {activeProductId === item.id ? "Dang edit" : "Edit"}
                      </Link>
                      <button className="btn-outline-danger" type="button">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="py-8 text-center text-sm text-slate-500"
                  colSpan={8}
                >
                  Khong co product phu hop voi bo loc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        itemLabel="products"
        nextHref={pagination.nextHref}
        previousHref={pagination.previousHref}
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
      />
    </>
  );
}
