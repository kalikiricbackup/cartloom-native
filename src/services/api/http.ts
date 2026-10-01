import type { AxiosRequestConfig, AxiosResponse } from "axios";
import apiClient from "../ApiClient";

export const getApi = <TResponse = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<TResponse>> => apiClient.get<TResponse>(url, config);

export const postApi = <TResponse = unknown, TRequest = unknown>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<TResponse>> =>
  apiClient.post<TResponse>(url, data, config);

export const putApi = <TResponse = unknown, TRequest = unknown>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<TResponse>> =>
  apiClient.put<TResponse>(url, data, config);

export const patchApi = <TResponse = unknown, TRequest = unknown>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<TResponse>> =>
  apiClient.patch<TResponse>(url, data, config);

export const deleteApi = <TResponse = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<TResponse>> =>
  apiClient.delete<TResponse>(url, config);
