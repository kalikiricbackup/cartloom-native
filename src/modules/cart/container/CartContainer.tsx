import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { useToast } from "@/contexts/ToastContext";
import { cartActions, fetchCart } from "@/features/cartSlice";
import { addWishlistProduct } from "@/features/wishlistSlice";
import { MAX_CART_QUANTITY, type CartItem } from "@/services/api";
import { deleteCartItem, updateCartItemQuantity } from "@/services/api";
import type { AppDispatch, RootState } from "@/store/store";
import CartPresenter from "../presenter/CartPresenter";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string") return error;
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

export default function CartContainer() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const { accessToken, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  );
  const {
    items: cartItems,
    status: cartStatus,
    error: cartError,
    loadedForToken,
  } = useSelector((state: RootState) => state.cart);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [isCartActionLoading, setIsCartActionLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && accessToken) {
        void dispatch(fetchCart({ accessToken, force: true }));
      }
    }, [accessToken, dispatch, isAuthenticated]),
  );

  const retry = () => {
    if (accessToken) void dispatch(fetchCart({ accessToken, force: true }));
  };

  const visibleItems =
    isAuthenticated && loadedForToken === accessToken ? cartItems : [];

  const changeQuantity = async (item: CartItem, quantity: number) => {
    const variant = item.variant;
    if (
      updatingItemId !== null ||
      !accessToken ||
      quantity < 1 ||
      quantity > MAX_CART_QUANTITY ||
      (variant?.stock !== undefined && quantity > variant.stock)
    ) {
      return;
    }

    setUpdatingItemId(item.id);
    try {
      await updateCartItemQuantity(item.id, quantity, accessToken);
      dispatch(
        cartActions.setCartQuantity({ itemId: item.id, quantity }),
      );
    } catch (updateError) {
      showToast({
        message: getErrorMessage(
          updateError,
          "Unable to update the item quantity.",
        ),
        type: "error",
      });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (item: CartItem) => {
    if (updatingItemId !== null || !accessToken) return;

    setUpdatingItemId(item.id);
    setIsCartActionLoading(true);
    try {
      await deleteCartItem(item.id, accessToken);
      dispatch(cartActions.removeCartItem(item.id));
      showToast({ message: "Item removed from cart", type: "success" });
    } catch (removeError) {
      showToast({
        message: getErrorMessage(removeError, "Unable to remove this item."),
        type: "error",
      });
    } finally {
      setIsCartActionLoading(false);
      setUpdatingItemId(null);
    }
  };

  const moveToWishlist = async (item: CartItem) => {
    if (updatingItemId !== null || !accessToken) return;

    setUpdatingItemId(item.id);
    setIsCartActionLoading(true);
    try {
      await dispatch(
        addWishlistProduct({
          product_id: item.productId,
          variant_id: item.variantId,
        }),
      ).unwrap();

      try {
        await deleteCartItem(item.id, accessToken);
        dispatch(cartActions.removeCartItem(item.id));
        showToast({ message: "Item moved to wishlist", type: "success" });
      } catch (removeError) {
        showToast({
          message: `Item was saved to your wishlist but could not be removed from cart. ${getErrorMessage(removeError, "Please try again.")}`,
          type: "error",
        });
      }
    } catch (wishlistError) {
      showToast({
        message: getErrorMessage(
          wishlistError,
          "Unable to save this item to your wishlist.",
        ),
        type: "error",
      });
    } finally {
      setIsCartActionLoading(false);
      setUpdatingItemId(null);
    }
  };

  return (
    <CartPresenter
      items={visibleItems}
      updatingItemId={updatingItemId}
      isCartActionLoading={isCartActionLoading}
      isLoading={isAuthenticated && cartStatus === "loading"}
      isAuthenticated={isAuthenticated}
      error={isAuthenticated ? cartError : null}
      onRetry={retry}
      onSignIn={() => router.push(AppRoutes.login)}
      onQuantityChange={(item, quantity) => void changeQuantity(item, quantity)}
      onRemove={(item) => void removeItem(item)}
      onMoveToWishlist={(item) => void moveToWishlist(item)}
      onCheckout={() =>
        showToast({ message: "Checkout will be available soon.", type: "info" })
      }
    />
  );
}
