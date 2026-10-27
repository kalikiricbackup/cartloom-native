import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { useToast } from "@/contexts/ToastContext";
import { fetchWishlist, removeWishlistProduct } from "@/features/wishlistSlice";
import type { WishlistEntry } from "@/services/api";
import type { AppDispatch, RootState } from "@/store/store";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import { showAppAlert } from "@/utils/showAppAlert";
import WishlistPresenter from "../presenter/WishlistPresenter";

const WishlistContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const { entries, status, error } = useSelector(
    (state: RootState) => state.wishlist,
  );
  const { accessToken } = useSelector((state: RootState) => state.user);

  useFocusEffect(
    useCallback(() => {
      if (accessToken) {
        void dispatch(fetchWishlist({ force: true }));
      }
    }, [accessToken, dispatch]),
  );

  const confirmRemove = (entry: WishlistEntry) => {
    const productName = entry.product?.name ?? `Product #${entry.product_id}`;
    showAppAlert(
      `Remove ${productName}?`,
      "This item will be removed from your wishlist.",
      [
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void dispatch(removeWishlistProduct(entry.product_id))
              .unwrap()
              .then(() => {
                showToast({
                  message: "Product removed from wishlist",
                  type: "success",
                });
              })
              .catch((removeError: unknown) => {
                showToast({
                  message:
                    typeof removeError === "string"
                      ? removeError
                      : removeError instanceof Error
                        ? removeError.message
                        : "Unable to remove this product from your wishlist.",
                  type: "error",
                });
              });
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const removeProduct = (entry: WishlistEntry) => {
    confirmRemove(entry);
  };

  const retry = () => {
    void dispatch(fetchWishlist({ force: true }));
  };

  return (
    <WishlistPresenter
      entries={entries}
      isLoading={status === "loading"}
      error={accessToken ? error : "Sign in to view your wishlist."}
      onRetry={accessToken ? retry : undefined}
      onBack={() => router.navigate(AppRoutes.home)}
      onOpenProduct={(productId) => {
        blurFocusedWebElement();
        router.push({
          pathname: AppRoutes.productDetails,
          params: { productId: String(productId) },
        });
      }}
      onRemoveProduct={removeProduct}
    />
  );
};

export default WishlistContainer;
