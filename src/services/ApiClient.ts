import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BaseUrl } from "./Config";
import { ErrorHandler } from "./ErrorHandler";

// ---------------------------
// Interfaces
// ---------------------------
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  authType?: "basic" | "bearer";
}
interface ErrorResponse {
  message?: string;
  errorCode?: string;
}

// ---------------------------
// Axios instance
// ---------------------------
const apiClient = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// ---------------------------
// Helpers
// ---------------------------
const logApiRequest = (method: string, url: string, data?: any) => {
  console.log(`[API REQUEST] ${method.toUpperCase()} ${url}`, data || "");
};

const logApiResponse = (url: string, status: number, data?: any) => {
  console.log(`[API RESPONSE] ${status} - ${url}`, data || "");
};

const logApiError = (url: string, error: any) => {
  console.error(
    `[API ERROR] ${url}`,
    error.response ? error.response.data : error.message,
  );
};

// ---------------------------
// Request Interceptor
// ---------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestConfig = config as CustomAxiosRequestConfig;

    if (
      requestConfig.authType === "bearer" &&
      authToken &&
      !config.headers.has("Authorization")
    ) {
      config.headers.set("Authorization", `Bearer ${authToken}`);
    }

    logApiRequest(config.method || "GET", config.url || "", config.data);
    return config;
  },
  (error) => {
    console.error("[REQUEST ERROR]", error);
    return Promise.reject(error);
  },
);

// ---------------------------
// Response Interceptor
// ---------------------------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logApiResponse(response.config.url || "", response.status, response.data);
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    logApiError(originalRequest?.url || "", error);
    return Promise.reject(ErrorHandler(error));
  },
);

export default apiClient;
