"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { formatCurrency } from "@/lib/util/formatCurrency";
import { buildProductsPageHref } from "@/lib/admin/products-url";
import type { AdminProductItem, AdminProductsFilters, ProductStatus } from "@/types/product";
import { useDeleteProductMutation, useUpdateStatusProductMutation } from "@/client/api/backend-api";
import { useNotification } from "@/components/ui/BrowserNotification";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  // Bo loc hien tai de build link edit giu lai filter va page hien tai.
  filters: AdminProductsFilters;
  pagination: ProductsTablePagination;
  // Danh sach product dang hien thi trong bang.
  products: AdminProductItem[];
};

const PRODUCT_STATUS_ACTION = {
  ACTIVE: {
    label: "Inactive",
    nextStatus: "INACTIVE",
  },
  INACTIVE: {
    label: "Active",
    nextStatus: "ACTIVE",
  },
} as const satisfies Record<
  ProductStatus,
  { label: string; nextStatus: ProductStatus }
>;

export function ProductsTable({
  activeProductId,
  filters,
  pagination,
  products,
}: ProductsTableProps) {
  const [deleteProduct,{isLoading}] = useDeleteProductMutation()
  const [updateStatus,statusUpdateStatus] = useUpdateStatusProductMutation()
  const { showNotification} = useNotification()
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<number|null>(null)
  const [statusUpdateId, setStatusUpdateId] = useState<number| null>(null)

  // xoa san pham 
  async function handeDeleteProduct(id: number) {
    const isConfirm = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này?"
    );

    if (!isConfirm) {
      return;
    }
    setDeleteId(id)
    try {
      const repone = await deleteProduct(id).unwrap()
      router.refresh();
      showNotification(repone.message,{tone:"success",title:"xóa thành công sản phẩm"})
  } catch (e) {
      showNotification(getApiErrorMessage(e,"lỗi khi xóa sản phẩm"), { tone: "error", title: "lỗi khi xóa sản phẩm " })
      console.log(e)
    }
    finally{
      setDeleteId(null)
    }
  }


  // update status product
  async function handlStatus(id: number, status: ProductStatus){
    setStatusUpdateId(id)
    try{
      const repone = await updateStatus({ productId: id, status }).unwrap()
      router.refresh();
      showNotification(repone.message,{tone:"success",title:"cap nhat status thanh cong"})
    }catch(e){
      showNotification(getApiErrorMessage(e,"loi khi cap nhat status"), { tone: "error", title: "loi khi cap nhat status" })
      console.log(e)
    }finally{
      setStatusUpdateId(null)
    }
  }

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
              products.map((item) => {
                const statusAction = PRODUCT_STATUS_ACTION[item.status];

                return (
                <tr className="border-b border-slate-100" key={item.id}>
                  <td className="py-3 font-semibold text-slate-800">#{item.id}</td>
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.categoryName}</td>
                  <td className="py-3">
                    {formatCurrency(item.price)}
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
                        href={buildProductsPageHref({
                          editingId: item.id,
                          filters,
                          page: pagination.currentPage,
                        })}
                        scroll={true}
                      >
                        {activeProductId === item.id ? "Dang edit" : "Edit"}
                      </Link>
                      <button
                        className="btn-outline-danger disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isLoading}
                        type="button"
                        onClick={() => handeDeleteProduct(item.id)}
                      >
                        {deleteId === item.id ?"Đang xóa" : "Delete"}
                      </button>
                      <button
                        className="btn-outline disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={statusUpdateStatus.isLoading}
                        type="button"
                        onClick={() => handlStatus(item.id, statusAction.nextStatus)}
                      >
                        {statusUpdateId === item.id ? "Dang cap nhat" : statusAction.label}
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
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
