import { useCallback, useEffect, useRef } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

interface UseInfiniteScrollOptions {
  enabled: boolean;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export default function useInfiniteScroll({
  enabled,
  hasMore,
  loading,
  onLoadMore,
  threshold = 500,
}: UseInfiniteScrollOptions) {
  const loadingRef = useRef(loading);
  const requestStartedRef = useRef(false);

  useEffect(() => {
    loadingRef.current = loading;
    if (!loading) requestStartedRef.current = false;
  }, [loading]);

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const hasScrollableContent =
        contentSize.height > layoutMeasurement.height && contentOffset.y > 0;
      const isNearEnd =
        contentOffset.y + layoutMeasurement.height >=
        contentSize.height - threshold;

      if (
        !enabled ||
        !hasMore ||
        loadingRef.current ||
        requestStartedRef.current ||
        !hasScrollableContent ||
        !isNearEnd
      ) {
        return;
      }

      requestStartedRef.current = true;
      onLoadMore();
    },
    [enabled, hasMore, onLoadMore, threshold],
  );
}
