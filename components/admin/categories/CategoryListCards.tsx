"use client";

import { CategoryImagePreview } from "./CategoryImagePreview";
import { formatLocalDateTime } from "@/lib/util/formatDateTime";
import { CategorySummaryResponse } from "@/types/categories";
import { Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";

type CategoryCardsProps = {
  data: CategorySummaryResponse[] | null
  error: string | null
  editingId: number | null
};

export function CategoryListCards({ data, error, editingId }: CategoryCardsProps) {
  const router = useRouter()

  function handerEdit(isSelected: boolean,id:number) {
    if (isSelected) {
      router.replace("/admin/categories");
    } else {
      router.replace(`/admin/categories?edit=${id}`);
    }
  }

  return (
    <article className="panel">
      <h2 className="text-lg font-semibold text-slate-900">Category cards</h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* nếu có error */}
        {error && (
          <div className="col-span-2 text-sm text-error">
            {error}
          </div>
        )}

        {/*  nếu không có data */}
        {!error && !data && (
          <div className="col-span-2 text-sm text-slate-500">
            Không có dữ liệu
          </div>
        )}

        {/*  nếu có data */}
        {data &&
          data.map((category) => {
            // lưu id danh mục đang đc chỉnh sửa
            const isSelected = category.id == editingId
            return (<div
              className="rounded-2xl border border-slate-200 bg-white p-4"
              key={category.id}
            >
              <CategoryImagePreview image={category.image} name={category.name} />

              <p className="font-semibold text-slate-900">
                {category.name}
              </p>

              <dl className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <dt className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase text-slate-400">
                    <Clock3 className="size-3.5" />
                    Created
                  </dt>
                  <dd className="text-right text-sm font-medium leading-5 text-slate-700">
                    {formatLocalDateTime(category.createdAt)}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-3 border-t border-slate-200 pt-2">
                  <dt className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase text-slate-400">
                    <Clock3 className="size-3.5" />
                    Updated
                  </dt>
                  <dd className="text-right text-sm font-medium leading-5 text-slate-700">
                    {formatLocalDateTime(category.updatedAt)}
                  </dd>
                </div>
              </dl>

              <div className="mt-3 flex items-center justify-between text-sm">

                <span className="chip chip-primary"> products</span>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                    type="button"
                    onClick={()=> handerEdit(isSelected,category.id)}
                  >
                    {isSelected ? "Đang chỉnh sửa" : "Edit"}
                  </button>

                  <button
                    className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-error"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            )
          })}
      </div>
    </article>
  );
}
