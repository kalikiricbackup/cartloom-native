import type { AxiosResponse } from "axios";
import type { LoginRequest, LoginResponse } from "../../types/api/login";
import type {
  RegisterRequest,
  RegisterResponse,
} from "../../types/api/registration";
import { postApi } from "./http";

export const loginUser = (
  data: LoginRequest,
  url: string,
): Promise<AxiosResponse<LoginResponse>> =>
  postApi<LoginResponse, LoginRequest>(url, data);

export const registerUser = (
  data: RegisterRequest,
  url: string,
): Promise<AxiosResponse<RegisterResponse>> =>
  postApi<RegisterResponse, RegisterRequest>(url, data);
