import { ApiUrls } from "@/constants/ApiUrls";
import type { Address } from "@/types/api/address";
import type { HomeApiResponse } from "@/types/api/home";
import type { ProductDetails } from "@/types/api/productDetails";
import type {
  ProductListQuery,
  ProductListResponse,
  ProductVariant,
} from "@/types/api/productList";
import type { CurrentUser } from "@/types/api/profile";
import type { AxiosResponse } from "axios";
import type { LoginRequest, LoginResponse } from "../../types/api/login";
import type {
  RegisterRequest,
  RegisterResponse,
} from "../../types/api/registration";
import { deleteApi, getApi, patchApi, postApi } from "./http";

export interface WishlistEntry {
  wishlist_item_id?: number | string;
  product_id: number;
  variant_id: string;
  variant?: Pick<ProductVariant, "options" | "price" | "images">;
  product?: { name: string; rating: number; reviews: number };
}

export interface CartItemCreate {
  parentId: number;
  variant_id: string;
  quantity?: number;
}

export const MAX_CART_QUANTITY = 99;

export interface CartItem {
  id: number;
  productId: number;
  variantId: string;
  quantity: number;
  productName?: string;
  unitPrice?: number;
  variant?: CartItemVariant;
}

export interface CartItemVariant {
  variantid: string;
  options: ProductVariant["options"];
  price: number;
  originalPrice?: number;
  stock?: number;
  images: string[];
}

export type WishlistAddRequest = Pick<
  WishlistEntry,
  "product_id" | "variant_id"
>;

export interface AddressSaveRequest {
  address: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pin: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isWishlistVariant = (
  value: unknown,
): value is NonNullable<WishlistEntry["variant"]> =>
  isRecord(value) &&
  typeof value.price === "number" &&
  Array.isArray(value.images) &&
  value.images.every((image) => typeof image === "string") &&
  Array.isArray(value.options) &&
  value.options.every(
    (option) => isRecord(option) && typeof option.value === "string",
  );

const isWishlistProduct = (
  value: unknown,
): value is NonNullable<WishlistEntry["product"]> =>
  isRecord(value) &&
  typeof value.name === "string" &&
  typeof value.rating === "number" &&
  typeof value.reviews === "number";

const toPositiveInteger = (value: unknown): number | null => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const getWishlistItems = (data: unknown): unknown[] | null => {
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      return getWishlistItems(JSON.parse(data));
    } catch {
      return null;
    }
  }
  if (!isRecord(data)) return null;

  const containerKeys = [
    "items",
    "data",
    "wishlist",
    "wishlist_items",
    "wishlistItems",
    "results",
    "entries",
    "response",
    "payload",
  ];

  for (const key of containerKeys) {
    const nested = data[key];
    if (Array.isArray(nested)) return nested;
    if (isRecord(nested)) {
      const items = getWishlistItems(nested);
      if (items) return items;
    }
  }

  for (const [key, nested] of Object.entries(data)) {
    if (containerKeys.includes(key)) continue;
    if (
      Array.isArray(nested) &&
      nested.every(
        (item) =>
          isRecord(item) &&
          ("product_id" in item || "productId" in item || "product" in item),
      )
    ) {
      return nested;
    }
    if (isRecord(nested)) {
      const items = getWishlistItems(nested);
      if (items) return items;
    }
  }

  return null;
};

const normalizeWishlistEntry = (value: unknown): WishlistEntry => {
  if (!isRecord(value)) {
    throw new Error("Wishlist response contains an invalid item.");
  }

  const productId = toPositiveInteger(
    value.product_id ??
      value.productId ??
      (isRecord(value.product) ? value.product.id : undefined),
  );
  const variantId =
    typeof value.variant_id === "string"
      ? value.variant_id.trim()
      : typeof value.variantId === "string"
        ? value.variantId.trim()
        : isRecord(value.variant) && typeof value.variant.variantid === "string"
          ? value.variant.variantid.trim()
          : "";

  if (productId === null || !variantId) {
    throw new Error("Wishlist response contains an invalid item.");
  }

  const wishlistItemId = toPositiveInteger(value.wishlist_item_id ?? value.id);

  return {
    wishlist_item_id: wishlistItemId ?? undefined,
    product_id: productId,
    variant_id: variantId,
    variant: isWishlistVariant(value.variant) ? value.variant : undefined,
    product: isWishlistProduct(value.product) ? value.product : undefined,
  };
};

export const parseWishlistEntries = (data: unknown): WishlistEntry[] => {
  const items = getWishlistItems(data);
  if (!items) {
    const keys = isRecord(data) ? Object.keys(data).join(", ") : typeof data;
    throw new Error(
      `Wishlist response has an invalid format (received ${keys || "no fields"}).`,
    );
  }

  return items.map(normalizeWishlistEntry);
};

export const getWishlist = async (
  accessToken: string,
): Promise<WishlistEntry[]> => {
  const response = await getApi<unknown>(ApiUrls.wishlist, {
    headers: { Authorization: "Bearer " + accessToken },
  });
  return parseWishlistEntries(response.data);
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

export const parseCurrentUser = (data: unknown): CurrentUser => {
  if (
    !isRecord(data) ||
    typeof data.id !== "number" ||
    !Number.isSafeInteger(data.id) ||
    data.id < 1 ||
    (data.full_name !== null && typeof data.full_name !== "string") ||
    (data.email !== null && typeof data.email !== "string") ||
    (data.gender !== null &&
      (typeof data.gender !== "number" ||
        !Number.isSafeInteger(data.gender))) ||
    (data.phone_number !== null &&
      typeof data.phone_number !== "string") ||
    typeof data.profile_completed !== "boolean"
  ) {
    throw new Error("Profile response has an invalid format.");
  }

  return {
    id: data.id,
    full_name: data.full_name,
    email: data.email,
    gender: data.gender,
    phone_number: data.phone_number,
    profile_completed: data.profile_completed,
  };
};

export const getCurrentUser = async (
  accessToken: string,
): Promise<CurrentUser> => {
  const response = await getApi<unknown>(ApiUrls.currentUser, {
    headers: { Authorization: "Bearer " + accessToken },
  });
  return parseCurrentUser(response.data);
};

const firstNumber = (
  item: Record<string, unknown>,
  keys: string[],
): number | undefined => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
      return value;
    }
  }
  return undefined;
};

const firstString = (
  item: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
};

const isCartOption = (
  value: unknown,
): value is ProductVariant["options"][number] =>
  isRecord(value) &&
  typeof value.type === "string" &&
  typeof value.label === "string" &&
  typeof value.value === "string";

const parseCartVariant = (
  value: unknown,
  variantId: string,
): CartItemVariant | undefined => {
  if (
    !isRecord(value) ||
    value.variantid !== variantId ||
    typeof value.price !== "number" ||
    !Number.isFinite(value.price) ||
    !Array.isArray(value.options) ||
    !value.options.every(isCartOption) ||
    !Array.isArray(value.images) ||
    !value.images.every((image) => typeof image === "string")
  ) {
    return undefined;
  }

  return {
    variantid: variantId,
    options: value.options,
    price: value.price,
    ...(typeof value.originalPrice === "number" &&
    Number.isFinite(value.originalPrice)
      ? { originalPrice: value.originalPrice }
      : {}),
    ...(typeof value.stock === "number" && Number.isFinite(value.stock)
      ? { stock: value.stock }
      : {}),
    images: value.images,
  };
};

const parseCartAmount = (value: unknown): number | undefined => {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(amount) && amount >= 0 ? amount : undefined;
};

export const parseCartItems = (data: unknown): CartItem[] => {
  const items = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.items)
      ? data.items
      : null;

  if (!items) throw new Error("Cart response has an invalid format.");

  return items.map((value) => {
    if (!isRecord(value)) {
      throw new Error("Cart response contains an invalid item.");
    }

    const id = firstNumber(value, ["id", "item_id", "cart_item_id"]);
    const productId = firstNumber(value, [
      "product_id",
      "productId",
      "parentId",
      "parent_id",
    ]);
    const variantId = firstString(value, ["variant_id", "variantId"]);
    const quantity = value.quantity;

    if (
      id === undefined ||
      productId === undefined ||
      variantId === undefined ||
      typeof quantity !== "number" ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error("Cart response contains an invalid item.");
    }

    const productName = firstString(value, ["product_name", "productName"]);
    const unitPrice = parseCartAmount(value.unit_price);
    const variant = parseCartVariant(value.variant, variantId);

    return {
      id,
      productId,
      variantId,
      quantity,
      ...(productName ? { productName } : {}),
      ...(unitPrice !== undefined ? { unitPrice } : {}),
      ...(variant ? { variant } : {}),
    };
  });
};

export const getCart = async (accessToken: string): Promise<CartItem[]> => {
  const response = await getApi<unknown>(ApiUrls.cart, {
    headers: { Authorization: "Bearer " + accessToken },
  });
  const items = parseCartItems(response.data);
  if (__DEV__) {
    console.info(
      "[Cart API] Parsed cart items:",
      items.map(({ id, productId, productName, variantId, quantity }) => ({
        id,
        productId,
        productName,
        variantId,
        quantity,
      })),
    );
  }
  return items;
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

export const updateCartItemQuantity = async (
  itemId: number,
  quantity: number,
  accessToken: string,
): Promise<void> => {
  await patchApi<unknown, { quantity: number }>(
    ApiUrls.cartItem(itemId),
    { quantity },
    {
      headers: { Authorization: "Bearer " + accessToken },
    },
  );
};

export const getHomeData = async (): Promise<HomeApiResponse> => {
  const response = await getApi<HomeApiResponse>(ApiUrls.home, {});
  return response.data;
};

export const getProductList = async (
  {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    page,
    pageSize,
    sort,
  }: ProductListQuery,
  signal?: AbortSignal,
): Promise<ProductListResponse> => {
  const response = await getApi<ProductListResponse>(ApiUrls.productList, {
    signal,
    params: {
      ...(search ? { search } : {}),
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
  if (__DEV__) {
    console.info("[Product API] Product details response:", {
      requestedProductId: productId,
      responseProductId: response.data.id,
      variantIds: response.data.variants.map((variant) => variant.variantid),
    });
  }
  return response.data;
};

export const loginUser = (
  data: LoginRequest,
  url: string,
): Promise<AxiosResponse<LoginResponse>> =>
  postApi<LoginResponse, LoginRequest>(url, data);

export const logoutUser = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  await postApi<unknown, { refresh_token: string }>(
    ApiUrls.logout,
    { refresh_token: refreshToken },
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

export const getAddresses = async (
  accessToken: string,
): Promise<Address[]> => {
  const response = await getApi<Address[]>(ApiUrls.addresses, {
    headers: { Authorization: "Bearer " + accessToken },
  });
  return response.data;
};

export const createAddress = async (
  data: AddressSaveRequest,
  accessToken: string,
): Promise<void> => {
  await postApi<unknown, AddressSaveRequest>(ApiUrls.addresses, data, {
    headers: { Authorization: "Bearer " + accessToken },
  });
};

export const updateAddress = async (
  addressId: number,
  data: AddressSaveRequest,
  accessToken: string,
): Promise<void> => {
  await patchApi<unknown, AddressSaveRequest>(
    ApiUrls.address(addressId),
    data,
    {
      headers: { Authorization: "Bearer " + accessToken },
    },
  );
};

export const deleteAddress = async (
  addressId: number,
  accessToken: string,
): Promise<void> => {
  await deleteApi(ApiUrls.address(addressId), {
    headers: { Authorization: "Bearer " + accessToken },
  });
};
