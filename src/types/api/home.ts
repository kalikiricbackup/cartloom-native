import type { Product, ProductVariant } from "./productList";

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
}

export type HomeDealVariant = ProductVariant;

export interface HomeBestDeal extends Product {
  variants: HomeDealVariant[];
  deal: {
    productId: number;
    label: string;
    discountPercent: number;
    price: number;
    originalPrice: number;
  };
}

export interface HomeApiResponse {
  topCategories: HomeCategory[];
  bestDeals: HomeBestDeal[];
  pagination: {
    page: number;
    pageSize: number;
    totalProducts: number;
    totalPages: number;
  };
  products: Product[];
}
