import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { AppRoutes } from "@/constants/AppConstants";
import { useToast } from "@/contexts/ToastContext";
import { addCartItem, getProductDetails } from "@/services/api";
import type { RootState } from "@/store/store";
import type {
  ProductDetails,
  ProductDetailsVariant,
} from "@/types/api/productDetails";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import { showAppAlert } from "@/utils/showAppAlert";
import ProductDetailsPresenter from "../presenter/ProductDetailsPresenter";

const getStartingVariant = (product: ProductDetails) => {
  const availableVariants = product.variants.filter(
    (variant) => variant.stock > 0,
  );
  const variants = availableVariants.length
    ? availableVariants
    : product.variants;

  return variants.reduce<ProductDetailsVariant | undefined>(
    (lowest, variant) =>
      !lowest || variant.price < lowest.price ? variant : lowest,
    undefined,
  );
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Unable to load product details. Please try again.";
};

const ProductDetailsContainer = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const { productId } = useLocalSearchParams<{ productId?: string }>();
  const parsedProductId = Number(productId);
  const validProductId =
    Number.isSafeInteger(parsedProductId) && parsedProductId > 0
      ? parsedProductId
      : null;
  const [productResult, setProductResult] = useState<{
    productId: number;
    retryCount: number;
    product?: ProductDetails;
    error?: string;
  } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedVariantSelection, setSelectedVariantSelection] = useState<{
    productId: number;
    variantId: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (validProductId === null) return;

    const loadProduct = async () => {
      try {
        const response = await getProductDetails(validProductId);
        if (!cancelled) {
          setProductResult({
            productId: validProductId,
            retryCount,
            product: response,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setProductResult({
            productId: validProductId,
            retryCount,
            error: getErrorMessage(loadError),
          });
        }
      }
    };

    void loadProduct();
    return () => {
      cancelled = true;
    };
  }, [retryCount, validProductId]);

  const resultMatchesRequest =
    productResult?.productId === validProductId &&
    productResult.retryCount === retryCount;
  const product = resultMatchesRequest ? productResult?.product : undefined;
  const error =
    validProductId === null
      ? "A valid product ID is required to load product details."
      : resultMatchesRequest
        ? (productResult?.error ?? null)
        : null;
  const isLoading = validProductId !== null && !resultMatchesRequest;

  const selectedVariant =
    product?.variants.find(
      (variant) =>
        variant.variantid === selectedVariantSelection?.variantId &&
        product.id === selectedVariantSelection.productId,
    ) ?? (product ? getStartingVariant(product) : undefined);

  const handleOptionSelect = (type: string, value: string) => {
    if (!product || !selectedVariant) return;

    const matchingVariants = product.variants.filter((variant) =>
      variant.options.some(
        (option) => option.type === type && option.value === value,
      ),
    );
    const exactVariant = matchingVariants.find((variant) =>
      selectedVariant.options.every(
        (currentOption) =>
          currentOption.type === type ||
          !variant.options.some(
            (option) => option.type === currentOption.type,
          ) ||
          variant.options.some(
            (option) =>
              option.type === currentOption.type &&
              option.value === currentOption.value,
          ),
      ),
    );

    const nextVariant = exactVariant ?? matchingVariants[0];
    if (nextVariant) {
      setSelectedVariantSelection({
        productId: product.id,
        variantId: nextVariant.variantid,
      });
    }
  };

  const handleAddToCart = async (variant: ProductDetailsVariant) => {
    if (!product || isAddingToCart) return;
    if (!accessToken) {
      showToast({
        message: "Sign in to add items to your cart.",
        type: "error",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addCartItem(
        { parentId: variant.parentId, variant_id: variant.variantid },
        accessToken,
      );
      showToast({ message: `${product.name} added to cart.`, type: "success" });
    } catch (addError) {
      showToast({
        message:
          addError instanceof Error
            ? addError.message
            : "Unable to add this product to your cart.",
        type: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRetry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  const handleBuyNow = () => {
    showAppAlert("Checkout coming soon", "Checkout will be available soon.");
  };

  return (
    <ProductDetailsPresenter
      product={product}
      selectedVariant={selectedVariant}
      isLoading={isLoading}
      error={error}
      onRetry={handleRetry}
      onBack={() => router.back()}
      onOptionSelect={handleOptionSelect}
      onAddToCart={handleAddToCart}
      isAddingToCart={isAddingToCart}
      onBuyNow={handleBuyNow}
      onGoHome={() => {
        blurFocusedWebElement();
        router.replace(AppRoutes.home);
      }}
    />
  );
};

export default ProductDetailsContainer;
