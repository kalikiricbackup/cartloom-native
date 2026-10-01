import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const StorageKeys = {
  authSession: "cartloom.auth-session",
} as const;

export const setStorageItem = async <T>(
  key: string,
  value: T,
): Promise<void> => {
  const serializedValue = JSON.stringify(value);
  if (serializedValue === undefined) {
    throw new TypeError("Storage values must be JSON-serializable.");
  }

  if (Platform.OS === "web") {
    if (typeof globalThis.localStorage === "undefined") {
      throw new Error("Browser storage is unavailable.");
    }
    globalThis.localStorage.setItem(key, serializedValue);
    return;
  }

  await SecureStore.setItemAsync(key, serializedValue);
};

export const getStorageItem = async <T>(key: string): Promise<T | null> => {
  let serializedValue: string | null;

  if (Platform.OS === "web") {
    if (typeof globalThis.localStorage === "undefined") return null;
    serializedValue = globalThis.localStorage.getItem(key);
  } else {
    serializedValue = await SecureStore.getItemAsync(key);
  }

  if (serializedValue === null) return null;

  try {
    return JSON.parse(serializedValue) as T;
  } catch {
    return null;
  }
};

export const removeStorageItem = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    if (typeof globalThis.localStorage !== "undefined") {
      globalThis.localStorage.removeItem(key);
    }
    return;
  }

  await SecureStore.deleteItemAsync(key);
};
