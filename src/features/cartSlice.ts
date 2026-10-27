import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { userActions } from "@/features/userSlice";
import { getCart, type CartItem } from "@/services/api";

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loadedForToken: string | null;
  activeRequestId: string | null;
}

interface FetchCartRequest {
  accessToken: string;
  force?: boolean;
}

interface CartThunkState {
  user: { accessToken: string | null };
  cart: CartState;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
  loadedForToken: null,
  activeRequestId: null,
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Unable to load your cart.";
};

export const fetchCart = createAsyncThunk<
  CartItem[],
  FetchCartRequest,
  { state: CartThunkState; rejectValue: string }
>(
  "cart/fetch",
  async ({ accessToken }, { getState, rejectWithValue }) => {
    try {
      const items = await getCart(accessToken);
      if (getState().user.accessToken !== accessToken) {
        return rejectWithValue("Your session changed before the cart loaded.");
      }
      return items;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: ({ accessToken, force }, { getState }) => {
      const { cart, user } = getState();
      if (user.accessToken !== accessToken || !accessToken) return false;
      if (
        cart.status === "loading" &&
        cart.loadedForToken === accessToken &&
        force !== true
      ) {
        return false;
      }
      return (
        force === true ||
        cart.loadedForToken !== accessToken ||
        cart.status === "failed"
      );
    },
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartQuantity: (
      state,
      action: { payload: { itemId: number; quantity: number } },
    ) => {
      const item = state.items.find(
        (cartItem) => cartItem.id === action.payload.itemId,
      );
      if (item) item.quantity = action.payload.quantity;
    },
    removeCartItem: (state, action: { payload: number }) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.loadedForToken = action.meta.arg.accessToken;
        state.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
        state.loadedForToken = action.meta.arg.accessToken;
        state.activeRequestId = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        if (
          action.meta.condition ||
          state.activeRequestId !== action.meta.requestId
        ) {
          return;
        }
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Unable to load your cart.";
        state.loadedForToken = action.meta.arg.accessToken;
        state.activeRequestId = null;
      })
      .addCase(userActions.setCredentials, () => initialState)
      .addCase(userActions.logout, () => initialState);
  },
});

export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
