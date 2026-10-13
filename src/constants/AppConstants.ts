const statusCode400 = 400;
const statusCode403 = 403;
const statusCode404 = 404;
const statusCode500 = 500;

export const AppConstants = {
  statusCode400,
  statusCode403,
  statusCode404,
  statusCode500,
};

export const AppRoutes = {
  login: "/(auth)/login",
  registration: "/(auth)/registration",
  otp: "/(auth)/otp",
  home: "/(tabs)/home",
  productList: "/(tabs)/products",
  productDetails: "/(tabs)/product-details",
  search: "/(tabs)/search",
  wishlist: "/(tabs)/wishList",
} as const;
