export type ProductStatus = "ACTIVE" | "INACTIVE";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  purchases: number;
  status: ProductStatus;
};
