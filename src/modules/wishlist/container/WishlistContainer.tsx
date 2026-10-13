import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { useToast } from "@/contexts/ToastContext";
import { addCartItem, getProductDetails } from "@/services/api";
import type { WishlistEntry } from "@/services/api";
import {
  fetchWishlist,
  removeWishlistProduct,
} from "@/features/wishlistSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { ProductDetails } from "@/types/api/productDetails";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import { showAppAlert } from "@/utils/showAppAlert";
import WishlistPresenter from "../presenter/WishlistPresenter";

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

const WishlistContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const { entries, status, error } = useSelector(
    (state: RootState) => state.wishlist,
  );
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.user,
  );
  const [productsById, setProductsById] = useState<
    Record<number, ProductDetails>
  >({});
  const [loadingProductIds, setLoadingProductIds] = useState<number[]>([]);
  const [productErrors, setProductErrors] = useState<Record<number, string>>(
    {},
  );
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      void dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    let cancelled = false;
    const productIds = [...new Set(entries.map((entry) => entry.product_id))];

    setProductsById({});
    setProductErrors({});
    setLoadingProductIds(productIds);

    if (!productIds.length) return;

    const loadProducts = async () => {
      const results = await Promise.all(
        productIds.map(async (productId) => {
          try {
            return {
              productId,
              product: await getProductDetails(productId),
              error: null,
            };
          } catch (loadError) {
            return {
              productId,
              product: null,
              error: getErrorMessage(
                loadError,
                "Unable to load this product's details.",
              ),
            };
          }
        }),
      );

      if (cancelled) return;

      setProductsById(
        Object.fromEntries(
          results.flatMap((result) =>
            result.product ? [[result.productId, result.product]] : [],
          ),
        ),
      );
      setProductErrors(
        Object.fromEntries(
          results.flatMap((result) =>
            result.error ? [[result.productId, result.error]] : [],
          ),
        ),
      );
      setLoadingProductIds([]);
    };

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [entries]);

  const confirmRemove = (productId: number) => {
    showAppAlert(
      "Remove from wishlist?",
      `Remove product ${productId} from your wishlist?`,
      [
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void dispatch(removeWishlistProduct(productId))
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

  const removeProduct = (productId: number) => {
    confirmRemove(productId);
  };

  const retry = () => {
    if (status !== "loading") void dispatch(fetchWishlist());
  };

  const addToCart = async (entry: WishlistEntry) => {
    if (!isAuthenticated || !accessToken) {
      showToast({ message: "Sign in to add items to your cart.", type: "error" });
      return;
    }

    const variant = productsById[entry.product_id]?.variants.find(
      (item) => item.variantid === entry.variant_id,
    );
    if (!variant) {
      showToast({
        message: "Unable to load this product variant. Please try again.",
        type: "error",
      });
      return;
    }

    setAddingProductId(entry.product_id);
    try {
      await addCartItem(
        {
          parentId: variant.parentId,
          variant_id: variant.variantid,
          quantity: 1,
        },
        accessToken,
      );
      showToast({ message: "Product moved to cart", type: "success" });
    } catch (addError) {
      showToast({
        message: getErrorMessage(addError, "Unable to add this product to cart."),
        type: "error",
      });
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <WishlistPresenter
      entries={entries}
      productsById={productsById}
      loadingProductIds={loadingProductIds}
      productErrors={productErrors}
      addingProductId={addingProductId}
      isLoading={status === "loading"}
      error={isAuthenticated ? error : "Sign in to view your wishlist."}
      onRetry={isAuthenticated ? retry : undefined}
      onBack={() => router.navigate(AppRoutes.home)}
      onOpenProduct={(productId) => {
        blurFocusedWebElement();
        router.push({
          pathname: AppRoutes.productDetails,
          params: { productId: String(productId) },
        });
      }}
      onRemoveProduct={removeProduct}
      onAddToCart={(entry) => void addToCart(entry)}
    />
  );
};

export default WishlistContainer;
