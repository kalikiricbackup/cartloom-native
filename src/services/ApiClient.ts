import { AxiosHeaders, create } from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BaseUrl } from "./Config";
import { ErrorHandler } from "./ErrorHandler";

interface ErrorResponse {
  message?: unknown;
  detail?: unknown;
}

const apiClient = create({
  baseURL: BaseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let authToken: string | null = null;
let unauthorizedHandler: ((failedToken: string) => void | Promise<void>) | null =
  null;
let unauthorizedHandled = false;

export const setAuthToken = (token: string | null) => {
  if (authToken !== token) unauthorizedHandled = false;
  authToken = token;
};

export const setUnauthorizedHandler = (
  handler: ((failedToken: string) => void | Promise<void>) | null,
) => {
  unauthorizedHandler = handler;
};

// ---------------------------
// Helpers
// ---------------------------
const getSafeEndpoint = (url: string) => url.split(/[?#]/, 1)[0];

const logApiRequest = (method: string, url: string) => {
  console.log(`[API REQUEST] ${method.toUpperCase()} ${getSafeEndpoint(url)}`);
};

const logApiResponse = (url: string, status: number) => {
  console.log(`[API RESPONSE] ${status} - ${getSafeEndpoint(url)}`);
};

const logApiError = (url: string, status?: number) => {
  console.error(
    `[API ERROR] ${getSafeEndpoint(url)}${status ? ` (${status})` : ""}`,
  );
};

// ---------------------------
// Request Interceptor
// ---------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logApiRequest(config.method || "GET", config.url || "");
    return config;
  },
  (error) => {
    console.error("[REQUEST ERROR] Unable to prepare API request.");
    return Promise.reject(error);
  },
);

// ---------------------------
// Response Interceptor
// ---------------------------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logApiResponse(response.config.url || "", response.status);
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;

    logApiError(originalRequest?.url || "", error.response?.status);
    const authorization = AxiosHeaders.from(originalRequest?.headers).get(
      "Authorization",
    );
    const failedToken =
      typeof authorization === "string" &&
      authorization.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : null;

    if (
      error.response?.status === 401 &&
      failedToken &&
      failedToken === authToken &&
      unauthorizedHandler &&
      !unauthorizedHandled
    ) {
      unauthorizedHandled = true;
      try {
        await unauthorizedHandler?.(failedToken);
      } catch (handlerError) {
        console.error("Unable to handle an unauthorized session.", handlerError);
      }
    }

    return Promise.reject(ErrorHandler(error));
  },
);

export default apiClient;
