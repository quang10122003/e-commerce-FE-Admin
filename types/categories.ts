export interface CategorySummaryResponse {
    id: number;
    name: string;
    image: string;
    createdAt: string;  //LocalDatetime
    updatedAt: string; //LocalDatetime
};

export interface AdminListNewCategory{
    name:string
    createdAt:string
}

export interface AdminCategoryOverviewResponse {
    totalCategory: number;
    topCategory: string;
    emptyCategories: number;
    listNewCategory:AdminListNewCategory[]
}