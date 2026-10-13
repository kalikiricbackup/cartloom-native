import { ApiUrls } from "@/constants/ApiUrls";
import type { HomeApiResponse } from "@/types/api/home";
import type { ProductDetails } from "@/types/api/productDetails";
import type {
  ProductListQuery,
  ProductListResponse,
} from "@/types/api/productList";
import type { AxiosResponse } from "axios";
import type { LoginRequest, LoginResponse } from "../../types/api/login";
import type {
  RegisterRequest,
  RegisterResponse,
} from "../../types/api/registration";
import { deleteApi, getApi, postApi } from "./http";

export interface WishlistEntry {
  product_id: number;
  variant_id: string;
}

export interface CartItemCreate {
  parentId: number;
  variant_id: string;
  quantity?: number;
}

export type WishlistAddRequest = WishlistEntry;

const isWishlistEntry = (entry: unknown): entry is WishlistEntry =>
  typeof entry === "object" &&
  entry !== null &&
  "product_id" in entry &&
  typeof entry.product_id === "number" &&
  Number.isSafeInteger(entry.product_id) &&
  entry.product_id > 0 &&
  "variant_id" in entry &&
  typeof entry.variant_id === "string" &&
  entry.variant_id.trim().length > 0;

export const getWishlist = async (
  accessToken: string,
): Promise<WishlistEntry[]> => {
  const response = await getApi<unknown>(ApiUrls.wishlist, {
    headers: { Authorization: "Bearer " + accessToken },
  });
  if (!Array.isArray(response.data) || !response.data.every(isWishlistEntry)) {
    throw new Error("Wishlist response has an invalid format.");
  }
  return response.data;
};

export const addWishlistItem = async (
  request: WishlistAddRequest,
  accessToken: string,
): Promise<void> => {
  await postApi<unknown, WishlistAddRequest>(ApiUrls.wishlist, request, {
    headers: { Authorization: "Bearer " + accessToken },
  });
};

export const deleteWishlistItem = async (
  productId: number,
  accessToken: string,
): Promise<void> => {
  await deleteApi(ApiUrls.wishlistProduct(productId), {
    headers: { Authorization: "Bearer " + accessToken },
  });
};

export const getCart = async (accessToken: string): Promise<unknown> => {
  const response = await getApi<unknown>(ApiUrls.cart, {
    headers: { Authorization: "Bearer " + accessToken },
  });
  return response.data;
};

export const addCartItem = async (
  request: CartItemCreate,
  accessToken: string,
): Promise<unknown> => {
  const response = await postApi<unknown, CartItemCreate>(
    ApiUrls.cartItems,
    { quantity: 1, ...request },
    {
      headers: { Authorization: "Bearer " + accessToken },
    },
  );
  return response.data;
};

export const deleteCartItem = async (
  itemId: number,
  accessToken: string,
): Promise<void> => {
  await deleteApi(ApiUrls.cartItem(itemId), {
    headers: { Authorization: "Bearer " + accessToken },
  });
};

export const getHomeData = async (): Promise<HomeApiResponse> => {
  const response = await getApi<HomeApiResponse>(ApiUrls.home, {});
  return response.data;
};

export const getProductList = async ({
  NameDescriptionsearch,
  category,
  brand,
  minPrice,
  maxPrice,
  rating,
  page,
  pageSize,
  sort,
}: ProductListQuery, signal?: AbortSignal): Promise<ProductListResponse> => {
  const response = await getApi<ProductListResponse>(ApiUrls.productList, {
    signal,
    params: {
      ...(NameDescriptionsearch
        ? { NameDescriptionsearch }
        : {}),
      ...(category ? { category } : {}),
      ...(brand ? { brand } : {}),
      ...(minPrice !== undefined ? { minPrice } : {}),
      ...(maxPrice !== undefined ? { maxPrice } : {}),
      ...(rating !== undefined ? { rating } : {}),
      page,
      page_size: pageSize,
      sort,
    },
  });
  return response.data;
};

export const getProductDetails = async (
  productId: number,
): Promise<ProductDetails> => {
  const response = await getApi<ProductDetails>(
    ApiUrls.productDetails(productId),
    {},
  );
  return response.data;
};

export const loginUser = (
  data: LoginRequest,
  url: string,
): Promise<AxiosResponse<LoginResponse>> =>
  postApi<LoginResponse, LoginRequest>(url, data);

export const logoutUser = async (accessToken: string): Promise<void> => {
  await postApi<unknown, Record<string, never>>(
    ApiUrls.logout,
    {},
    {
      headers: { Authorization: "Bearer " + accessToken },
    },
  );
};

export const registerUser = (
  data: RegisterRequest,
  url: string,
): Promise<AxiosResponse<RegisterResponse>> =>
  postApi<RegisterResponse, RegisterRequest>(url, data);
