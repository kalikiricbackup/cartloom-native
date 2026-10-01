import { useLoaderHook } from "@/hooks/useLoaderHook";
import React, { createContext, useContext, type ReactNode } from "react";

interface LoadingContextValue {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextValue | null>(null);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [LoaderComponent, showLoading, hideLoading] = useLoaderHook();
  const [loading, setLoading] = React.useState(false);

  const startLoading = () => {
    setLoading(true);
    showLoading();
  };

  const stopLoading = () => {
    setLoading(false);
    hideLoading();
  };

  return (
    <LoadingContext.Provider
      value={{ loading, showLoading: startLoading, hideLoading: stopLoading }}
    >
      {children}
      {LoaderComponent()}
    </LoadingContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoadingProvider");
  }
  return context;
};
