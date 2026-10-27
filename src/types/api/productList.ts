export interface ProductOption {
  type: string;
  label: string;
  value: string;
}

export interface ProductVariant {
  variantid: string;
  productId: number;
  parentId: number;
  slug: string;
  options: ProductOption[];
  price: number;
  originalPrice: number;
  stock: number;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  rating: number;
  reviews: number;
  offers: string[];
  variants: ProductVariant[];
  badge?: string | null;
}

export interface ProductListResponse {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  products: Product[];
}

export type ProductListSort =
  | "popularity"
  | "rating"
  | "price_asc"
  | "price_desc";

export interface ProductListQuery {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page: number;
  pageSize: number;
  sort: ProductListSort;
}
