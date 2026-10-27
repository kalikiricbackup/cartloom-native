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
  account: "/(tabs)/account",
  productList: "/(tabs)/(browse)/products",
  productDetails: "/(tabs)/(browse)/product-details",
  search: "/(tabs)/(browse)/search",
  wishlist: "/(tabs)/wishList",
  cart: "/(tabs)/cart",
  profile: "/(tabs)/(account)/profile",
  addresses: "/(tabs)/(account)/addresses",
  addAddress: "/(tabs)/(account)/addOrEditAddress",
  editAddress: "/(tabs)/(account)/addOrEditAddress",
} as const;
