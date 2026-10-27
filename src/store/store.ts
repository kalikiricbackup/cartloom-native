import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "../features/cartSlice";
import { homeDataReducer } from "../features/homeDataSlice";
import { productCatalogReducer } from "../features/productCatalogSlice";
import { wishlistReducer } from "../features/wishlistSlice";
import { userReducer } from "../features/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    homeData: homeDataReducer,
    productCatalog: productCatalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
