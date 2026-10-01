import { BaseUrl } from "../services/Config";

const apiBaseUrl = BaseUrl.replace(/\/+$/, "");

export const ApiUrls = {
  register: `${apiBaseUrl}/auth/register`,
  login: `${apiBaseUrl}/auth/login`,
} as const;
