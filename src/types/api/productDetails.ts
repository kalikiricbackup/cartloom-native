export interface ProductDetailsOption {
  type: string;
  label: string;
  value: string;
}

export interface ProductDetailsVariant {
  variantid: string;
  productId: number;
  parentId: number;
  slug: string;
  options: ProductDetailsOption[];
  price: number;
  originalPrice: number;
  stock: number;
  images: string[];
}

export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  rating: number;
  reviews: number;
  offers: string[];
  variants: ProductDetailsVariant[];
  badge?: string | null;
}
