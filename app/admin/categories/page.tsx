import { Category } from "@/components/admin/categories/types";
import CategoriesPageClient from "./CategoriesPageClient";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { CategorySummaryResponse } from "@/types/categories";
import { NextSearchParams } from "@/types/next";

const categories: Category[] = [
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
const CATEGORIES_URL = "/admin/categories" 
async function getCategories() {
  try{
    const payload = await serverPrivateFetch<CategorySummaryResponse[]>(CATEGORIES_URL) 
    return {
      error:null,
      data:payload.data
    }
  }catch(e){
    return{
      data: null,
      error: getApiErrorMessage(e, "Không thể tải dữ liệu categories."),
    }
  }
}
export default async function CategoriesPage({ searchParams }: { searchParams: NextSearchParams }) {
  const {data ,error} = await getCategories()
  const pramsSearch = await searchParams;
  // id của danh mục đang đang edit
  const editingId = Number(pramsSearch.edit) || null;
  return (
    <CategoriesPageClient data={data} error={error} categories={categories} editingId={editingId}/>
  );
}
