"use client";

import { useRef } from "react";
import Form from "next/form";
import type { CategorySummaryResponse } from "@/types/categories";
import type { AdminProductsFilters } from "@/types/product";

type ProductFiltersProps = {
  // Danh sach category lay tu API de render option filter.
  categories: CategorySummaryResponse[] | null;
  // Bo loc hien tai lay tu URL, dung lam default value cho form.
  filters: AdminProductsFilters;
  errorCategory:string | null 
};

export function ProductFilters({ categories, filters, errorCategory }: ProductFiltersProps) {
  // Timeout debounce rieng cho o search, tranh submit lai URL sau moi ky tu.
  const submitTimeoutRef = useRef<number | null>(null);

  // Submit form bang GET de Next cap nhat search params va Server Component fetch lai data.
  function submitFilter(form: HTMLFormElement, delay: number) {
    if (submitTimeoutRef.current) {
      window.clearTimeout(submitTimeoutRef.current);
    }

    submitTimeoutRef.current = window.setTimeout(() => {
      form.requestSubmit();
    }, delay);
  }

  return (
    <Form
      action="/admin/products"
      className="flex flex-wrap items-center gap-3"
      onChange={(event) => {
        // Input search can debounce, select category/status thi submit ngay.
        const delay = event.target instanceof HTMLInputElement ? 350 : 0;
        submitFilter(event.currentTarget, delay);
      }}
      replace
      scroll={false}
    >
      <input
        className="field-input field-inline field-input-compact flex-1"
        defaultValue={filters.search}
        name="search"
        placeholder="Tim theo ten san pham"
        type="text"
      />

      <select
        className="field-select h-10"
        defaultValue={filters.categoryFilter}
        name="category"
      >
        {errorCategory ? (
          <option disabled={true} value="">Lỗi khi lấy danh mục</option>
        ) : (
          <>
            <option value="ALL">Tat ca category</option>

            {categories?.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </>
        )}
      </select>

      <select
        className="field-select h-10"
        defaultValue={filters.statusFilter}
        name="status"
      >
        <option value="ALL">Tat ca status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>
    </Form>
  );
}
