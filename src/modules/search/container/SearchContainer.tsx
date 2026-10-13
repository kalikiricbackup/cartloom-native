import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { AppRoutes } from "@/constants/AppConstants";
import { getProductList } from "@/services/api";
import type { Product } from "@/types/api/productList";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import SearchPresenter from "../presenter/SearchPresenter";

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Unable to search products. Please try again.";
};

const SearchContainer = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleQueryChange = (nextQuery: string) => {
    const searchTerm = nextQuery.trim();
    setQuery(nextQuery);

    if (!searchTerm) {
      setProducts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setProducts([]);
    setError(null);
    setIsLoading(true);
  };

  useEffect(() => {
    const searchTerm = query.trim();
    if (!searchTerm) return;

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      void getProductList(
        {
          NameDescriptionsearch: searchTerm,
          page: 1,
          pageSize: 20,
          sort: "popularity",
        },
        controller.signal,
      )
        .then((response) => {
          if (!controller.signal.aborted) setProducts(response.products);
        })
        .catch((searchError: unknown) => {
          if (!controller.signal.aborted) {
            setError(getErrorMessage(searchError));
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, retryCount]);

  return (
    <SearchPresenter
      query={query}
      products={products}
      isLoading={isLoading}
      error={error}
      onQueryChange={handleQueryChange}
      onBack={() => router.back()}
      onRetry={() => {
        setRetryCount((count) => count + 1);
        setProducts([]);
        setError(null);
        setIsLoading(true);
      }}
      onOpenProduct={(product) => {
        blurFocusedWebElement();
        router.push({
          pathname: AppRoutes.productDetails,
          params: { productId: String(product.id) },
        });
      }}
    />
  );
};

export default SearchContainer;
