import { createSlice } from "@reduxjs/toolkit";

export interface AuthSession {
  email: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  profileCompleted: boolean;
}

type UserState = {
  email: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  profileCompleted: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const initialState: UserState = {
  email: "",
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  profileCompleted: false,
  isAuthenticated: false,
  isLoading: false,
};

const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setCredentials: (state, action: { payload: AuthSession }) => {
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.tokenType = action.payload.tokenType;
      state.profileCompleted = action.payload.profileCompleted;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.email = "";
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.profileCompleted = false;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
