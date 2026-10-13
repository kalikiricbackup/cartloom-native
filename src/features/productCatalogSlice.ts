import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductList } from "@/services/api";
import type {
  Product,
  ProductListQuery,
  ProductListResponse,
} from "@/types/api/productList";

interface CatalogThunkState {
  productCatalog: ProductCatalogState;
}

interface ProductCatalogRequest extends ProductListQuery {
  force?: boolean;
}

interface ProductCatalogState {
  products: Product[];
  page: number;
  totalPages: number;
  count: number;
  status: "idle" | "loading" | "loadingMore" | "succeeded" | "failed";
  error: string | null;
  queryKey: string | null;
  filterKey: string | null;
  requestId: string | null;
}

const initialState: ProductCatalogState = {
  products: [],
  page: 1,
  totalPages: 1,
  count: 0,
  status: "idle",
  error: null,
  queryKey: null,
  filterKey: null,
  requestId: null,
};

const getFilterKey = ({
  NameDescriptionsearch,
  category,
  brand,
  minPrice,
  maxPrice,
  rating,
  pageSize,
  sort,
}: ProductListQuery) =>
  JSON.stringify([
    NameDescriptionsearch ?? null,
    category ?? null,
    brand ?? null,
    minPrice ?? null,
    maxPrice ?? null,
    rating ?? null,
    pageSize,
    sort,
  ]);

const getQueryKey = ({
  NameDescriptionsearch,
  category,
  brand,
  minPrice,
  maxPrice,
  rating,
  page,
  pageSize,
  sort,
}: ProductListQuery) =>
  JSON.stringify([
    NameDescriptionsearch ?? null,
    category ?? null,
    brand ?? null,
    minPrice ?? null,
    maxPrice ?? null,
    rating ?? null,
    page,
    pageSize,
    sort,
  ]);

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Unable to load products. Please try again.";
};

export const fetchProductCatalog = createAsyncThunk<
  ProductListResponse,
  ProductCatalogRequest,
  { state: CatalogThunkState; rejectValue: string }
>(
  "productCatalog/fetchProducts",
  async ({ force: _force, ...query }, { rejectWithValue }) => {
    try {
      const response = await getProductList(query);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (query, { getState }) => {
      if (query.force) return true;
      const catalog = getState().productCatalog;
      const queryKey = getQueryKey(query);
      if (catalog.status === "succeeded" && catalog.queryKey === queryKey) {
        return false;
      }
      return !(
        (catalog.status === "loading" || catalog.status === "loadingMore") &&
        catalog.queryKey === queryKey
      );
    },
  },
);

const productCatalogSlice = createSlice({
  name: "productCatalog",
  initialState,
  reducers: {
    clearProductCatalog: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCatalog.pending, (state, action) => {
        const filterKey = getFilterKey(action.meta.arg);
        const isLoadingMore =
          action.meta.arg.page > 1 && state.filterKey === filterKey;
        state.status = isLoadingMore ? "loadingMore" : "loading";
        state.error = null;
        state.queryKey = getQueryKey(action.meta.arg);
        state.filterKey = filterKey;
        state.requestId = action.meta.requestId;
        if (!isLoadingMore) {
          state.products = [];
          state.page = 1;
          state.totalPages = 1;
          state.count = 0;
        }
      })
      .addCase(fetchProductCatalog.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        if (action.meta.arg.page > 1) {
          const existingIds = new Set(state.products.map((product) => product.id));
          state.products = [
            ...state.products,
            ...action.payload.products.filter(
              (product) => !existingIds.has(product.id),
            ),
          ];
        } else {
          state.products = action.payload.products;
        }
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.count = action.payload.count;
        state.status = "succeeded";
        state.requestId = null;
      })
      .addCase(fetchProductCatalog.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error =
          action.payload ??
          action.error.message ??
          "Unable to load products. Please try again.";
        state.requestId = null;
      });
  },
});

export const productCatalogActions = productCatalogSlice.actions;
export const productCatalogReducer = productCatalogSlice.reducer;
