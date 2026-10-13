export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
}

export interface HomeDealVariant {
  id: string;
  productId: number;
  slug: string;
  options: { type: string; label: string; value: string }[];
  price: number;
  originalPrice: number;
  stock: number;
  images: string[];
}

export interface HomeBestDeal {
  id: number;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  rating: number;
  reviews: number;
  offers: string[];
  variants: HomeDealVariant[];
  badge: string;
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
}
