import { AxiosError } from "axios";
import { AppConstants } from "../constants/AppConstants";

const getValidationMessage = (data: unknown): string | undefined => {
  if (typeof data !== "object" || data === null || !("detail" in data)) {
    return undefined;
  }

  const details = (data as { detail?: unknown }).detail;
  if (!Array.isArray(details)) return undefined;

  const messages = details.flatMap((detail) => {
    if (typeof detail !== "object" || detail === null || !("msg" in detail)) {
      return [];
    }

    const message = (detail as { msg?: unknown }).msg;
    if (typeof message !== "string") return [];

    const location = (detail as { loc?: unknown }).loc;
    const field = Array.isArray(location)
      ? location.filter((part) => part !== "body").at(-1)
      : undefined;

    return [`${typeof field === "string" ? `${field}: ` : ""}${message}`];
  });

  return messages.length ? messages.join("\n") : undefined;
};

export const ErrorHandler = (
  error: AxiosError<{ message?: unknown; detail?: unknown }>,
): { message: string; status?: number } => {
  if (error.response) {
    const { status, data } = error.response;
    const responseMessage =
      typeof data?.message === "string" ? data.message : undefined;
    let message = "An unexpected error occurred.";

    switch (status) {
      case AppConstants.statusCode400:
        message = responseMessage || "Bad request. Please check your input.";
        break;
      case AppConstants.statusCode403:
        message = "You do not have permission to perform this action.";
        break;
      case AppConstants.statusCode404:
        message = "The requested resource was not found.";
        break;
      case 422:
        message =
          getValidationMessage(data) ||
          responseMessage ||
          "Please check the entered information.";
        break;
      case AppConstants.statusCode500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = responseMessage || message;
    }

    return { message, status };
  } else if (error.request) {
    return {
      message: "No response from server. Check your internet connection.",
    };
  } else {
    return { message: error.message };
  }
};
