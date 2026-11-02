import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { getOrderHistory, type OrderHistoryItem } from "@/services/api";
import type { RootState } from "@/store/store";
import OrdersPresenter from "../presenter/OrdersPresenter";

const PAGE_SIZE = 20;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
};

export default function OrdersContainer() {
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const requestSequence = useRef(0);
  const loadingMore = useRef(false);

  const loadFirstPage = useCallback(
    async (refresh = false) => {
      if (!accessToken) {
        setOrders([]);
        setError("Sign in to view your orders.");
        setIsLoading(false);
        return;
      }

      const sequence = ++requestSequence.current;
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      setLoadMoreError(null);

      try {
        const result = await getOrderHistory(accessToken, {
          page: 1,
          pageSize: PAGE_SIZE,
        });
        if (sequence !== requestSequence.current) return;
        setOrders(result.orders);
        setPage(result.page);
        setTotalPages(result.totalPages);
      } catch (requestError) {
        if (sequence === requestSequence.current) {
          setError(getErrorMessage(requestError, "Unable to load your orders."));
        }
      } finally {
        if (sequence === requestSequence.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [accessToken],
  );

  useFocusEffect(
    useCallback(() => {
      void loadFirstPage();
      return () => {
        requestSequence.current += 1;
      };
    }, [loadFirstPage]),
  );

  const loadMore = useCallback(async () => {
    if (
      !accessToken ||
      loadingMore.current ||
      isLoading ||
      isRefreshing ||
      isLoadingMore ||
      page >= totalPages
    ) {
      return;
    }

    loadingMore.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const result = await getOrderHistory(accessToken, {
        page: page + 1,
        pageSize: PAGE_SIZE,
      });
      setOrders((current) => [...current, ...result.orders]);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (requestError) {
      setLoadMoreError(
        getErrorMessage(requestError, "Unable to load more orders."),
      );
    } finally {
      loadingMore.current = false;
      setIsLoadingMore(false);
    }
  }, [accessToken, isLoading, isLoadingMore, isRefreshing, page, totalPages]);

  return (
    <OrdersPresenter
      orders={orders}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      isLoadingMore={isLoadingMore}
      error={error}
      loadMoreError={loadMoreError}
      hasMore={page < totalPages}
      onBack={() => router.navigate(AppRoutes.account)}
      onRetry={() => void loadFirstPage()}
      onRefresh={() => void loadFirstPage(true)}
      onLoadMore={() => void loadMore()}
    />
  );
}
