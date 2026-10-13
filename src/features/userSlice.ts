import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { ApiUrls } from "@/constants/ApiUrls";
import { ErrorHandler } from "@/services/ErrorHandler";
import {
  loginUser as loginUserApi,
  registerUser as registerUserApi,
} from "@/services/api";
import type { LoginRequest } from "@/types/api/login";
import type { RegisterRequest } from "@/types/api/registration";

export interface AuthSession {
  email: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  profileCompleted: boolean;
}

interface AuthThunkConfig {
  rejectValue: string;
}

const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{ message?: unknown; detail?: unknown }>(error)) {
    const responseMessage =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : undefined;
    return responseMessage ?? ErrorHandler(error).message;
  }

  return error instanceof Error ? error.message : fallback;
};

export const loginUser = createAsyncThunk<
  AuthSession,
  LoginRequest,
  AuthThunkConfig
>("user/login", async (request, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(request, ApiUrls.login);
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      profile_completed: profileCompleted,
    } = response.data;

    if (!accessToken || !refreshToken) {
      return rejectWithValue("Login response did not include auth tokens.");
    }

    return {
      email: request.email,
      accessToken,
      refreshToken,
      tokenType,
      profileCompleted,
    };
  } catch (error) {
    return rejectWithValue(
      getAuthErrorMessage(error, "Unable to log in. Please try again."),
    );
  }
});

export const registerUser = createAsyncThunk<
  AuthSession,
  RegisterRequest,
  AuthThunkConfig
>("user/register", async (request, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(request, ApiUrls.register);
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      profile_completed: profileCompleted,
    } = response.data;

    if (!accessToken || !refreshToken) {
      return rejectWithValue(
        "Registration response did not include auth tokens.",
      );
    }

    return {
      email: request.email,
      accessToken,
      refreshToken,
      tokenType,
      profileCompleted,
    };
  } catch (error) {
    return rejectWithValue(
      getAuthErrorMessage(
        error,
        "Unable to create your account. Please try again.",
      ),
    );
  }
});

type UserState = {
  email: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  profileCompleted: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadingMessage: string | null;
};

const initialState: UserState = {
  email: "",
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  profileCompleted: false,
  isAuthenticated: false,
  isLoading: false,
  loadingMessage: null,
};

const setAuthSession = (state: UserState, session: AuthSession) => {
  state.email = session.email;
  state.accessToken = session.accessToken;
  state.refreshToken = session.refreshToken;
  state.tokenType = session.tokenType;
  state.profileCompleted = session.profileCompleted;
  state.isAuthenticated = true;
  state.isLoading = false;
  state.loadingMessage = null;
};

const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setCredentials: (state, action: { payload: AuthSession }) => {
      setAuthSession(state, action.payload);
    },
    logout: (state) => {
      state.email = "";
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenType = null;
      state.profileCompleted = false;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.loadingMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = "Logging in...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        setAuthSession(state, action.payload);
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.loadingMessage = "Creating your account...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        setAuthSession(state, action.payload);
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.loadingMessage = null;
      });
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
