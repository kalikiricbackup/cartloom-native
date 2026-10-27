import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getHomeData } from "@/services/api";
import type { HomeApiResponse } from "@/types/api/home";

interface HomeDataState {
  topCategories: HomeApiResponse["topCategories"];
  bestDeals: HomeApiResponse["bestDeals"];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface HomeThunkState {
  homeData: HomeDataState;
}

const initialState: HomeDataState = {
  topCategories: [],
  bestDeals: [],
  status: "idle",
  error: null,
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
  return "Unable to load home data. Please try again.";
};

export const fetchHomeData = createAsyncThunk<
  HomeApiResponse,
  void,
  { state: HomeThunkState; rejectValue: string }
>(
  "homeData/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getHomeData();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().homeData.status !== "loading" &&
      getState().homeData.status !== "succeeded",
  },
);

const homeDataSlice = createSlice({
  name: "homeData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.topCategories = action.payload.topCategories;
        state.bestDeals = action.payload.bestDeals;
        state.status = "succeeded";
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ??
          action.error.message ??
          "Unable to load home data. Please try again.";
      });
  },
});

export const homeDataReducer = homeDataSlice.reducer;
