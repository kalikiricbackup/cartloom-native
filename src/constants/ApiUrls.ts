import { BaseUrl } from "../services/Config";

const apiBaseUrl = BaseUrl.replace(/\/+$/, "");

export const ApiUrls = {
  register: `${apiBaseUrl}/auth/register`,
  login: `${apiBaseUrl}/auth/login`,
  logout: `${apiBaseUrl}/auth/logout`,
  home: `${apiBaseUrl}/home`,
  productList: `${apiBaseUrl}/products`,
  productDetails: (productId: number) =>
    `${apiBaseUrl}/products/${productId}`,
  wishlist: `${apiBaseUrl}/wishlist`,
  wishlistProduct: (productId: number) =>
    `${apiBaseUrl}/wishlist/${productId}`,
  cart: `${apiBaseUrl}/cart`,
  cartItems: `${apiBaseUrl}/cart/items`,
  cartItem: (itemId: number) => `${apiBaseUrl}/cart/items/${itemId}`,
} as const;
