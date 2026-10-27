import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { userActions } from "@/features/userSlice";
import {
  addWishlistItem,
  deleteWishlistItem,
  getWishlist,
  type WishlistEntry,
} from "@/services/api";

interface WishlistState {
  entries: WishlistEntry[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  fetchRequestId: string | null;
}

interface WishlistThunkState {
  user: { isAuthenticated: boolean; accessToken: string | null };
  wishlist: WishlistState;
}

const initialState: WishlistState = {
  entries: [],
  status: "idle",
  error: null,
  fetchRequestId: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
};

export const fetchWishlist = createAsyncThunk<
  WishlistEntry[],
  { force?: boolean } | void,
  { state: WishlistThunkState; rejectValue: string }
>(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    const { accessToken } = getState().user;
    if (!accessToken) {
      return rejectWithValue("Sign in to view your wishlist.");
    }

    try {
      const entries = await getWishlist(accessToken);
      if (getState().user.accessToken !== accessToken) {
        return rejectWithValue("Your session ended before the wishlist loaded.");
      }
      return entries;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load your wishlist."),
      );
    }
  },
  {
    condition: (request, { getState }) =>
      Boolean(request && request.force) ||
      getState().wishlist.status !== "loading",
  },
);

export const addWishlistProduct = createAsyncThunk<
  WishlistEntry,
  WishlistEntry,
  { state: WishlistThunkState; rejectValue: string }
>(
  "wishlist/add",
  async (entry, { getState, rejectWithValue }) => {
    const { isAuthenticated, accessToken } = getState().user;
    if (!isAuthenticated || !accessToken) {
      return rejectWithValue("Sign in to add products to your wishlist.");
    }

    try {
      await addWishlistItem(entry, accessToken);
      if (!getState().user.isAuthenticated) {
        return rejectWithValue("Your session ended before the wishlist updated.");
      }
      return entry;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to add this product to your wishlist."),
      );
    }
  },
);

export const removeWishlistProduct = createAsyncThunk<
  number,
  number,
  { state: WishlistThunkState; rejectValue: string }
>(
  "wishlist/remove",
  async (productId, { getState, rejectWithValue }) => {
    const { isAuthenticated, accessToken } = getState().user;
    if (!isAuthenticated || !accessToken) {
      return rejectWithValue("Sign in to update your wishlist.");
    }

    try {
      await deleteWishlistItem(productId, accessToken);
      return productId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Unable to remove this product from your wishlist.",
        ),
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.fetchRequestId = action.meta.requestId;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.entries = action.payload;
        state.status = "succeeded";
        state.error = null;
        state.fetchRequestId = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        if (
          action.meta.condition ||
          state.fetchRequestId !== action.meta.requestId
        ) {
          return;
        }
        state.status = "failed";
        state.error =
          action.payload ??
          action.error.message ??
          "Unable to load your wishlist.";
        state.fetchRequestId = null;
      })
      .addCase(addWishlistProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(addWishlistProduct.fulfilled, (state, action) => {
        const exists = state.entries.some(
          (entry) => entry.product_id === action.payload.product_id,
        );
        if (!exists) state.entries.push(action.payload);
        state.error = null;
      })
      .addCase(addWishlistProduct.rejected, (state, action) => {
        state.error =
          action.payload ??
          action.error.message ??
          "Unable to add this product to your wishlist.";
      })
      .addCase(removeWishlistProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(removeWishlistProduct.fulfilled, (state, action) => {
        state.entries = state.entries.filter(
          (entry) => entry.product_id !== action.payload,
        );
        state.error = null;
      })
      .addCase(removeWishlistProduct.rejected, (state, action) => {
        state.error =
          action.payload ??
          action.error.message ??
          "Unable to remove this product from your wishlist.";
      })
      .addCase(userActions.logout, () => initialState);
  },
});

export const wishlistActions = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
