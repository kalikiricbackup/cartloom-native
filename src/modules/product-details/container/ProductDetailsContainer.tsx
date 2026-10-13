import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { AppRoutes } from "@/constants/AppConstants";
import { getProductDetails } from "@/services/api";
import type {
  ProductDetails,
  ProductDetailsVariant,
} from "@/types/api/productDetails";
import { showAppAlert } from "@/utils/showAppAlert";
import { blurFocusedWebElement } from "@/utils/blurFocusedWebElement";
import ProductDetailsPresenter from "../presenter/ProductDetailsPresenter";

const getStartingVariant = (product: ProductDetails) => {
  const availableVariants = product.variants.filter(
    (variant) => variant.stock > 0,
  );
  const variants = availableVariants.length ? availableVariants : product.variants;

  return variants.reduce<ProductDetailsVariant | undefined>((lowest, variant) =>
    !lowest || variant.price < lowest.price ? variant : lowest,
  undefined);
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
  const { productId } = useLocalSearchParams<{ productId?: string }>();
  const parsedProductId = Number(productId);
  const validProductId =
    Number.isSafeInteger(parsedProductId) && parsedProductId > 0
      ? parsedProductId
      : null;
  const [product, setProduct] = useState<ProductDetails>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    if (validProductId === null) {
      setProduct(undefined);
      setError("A valid product ID is required to load product details.");
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setProduct(undefined);
    setError(null);
    setIsLoading(true);

    const loadProduct = async () => {
      try {
        const response = await getProductDetails(validProductId);
        if (!cancelled) setProduct(response);
      } catch (loadError) {
        if (!cancelled) setError(getErrorMessage(loadError));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadProduct();
    return () => {
      cancelled = true;
    };
  }, [retryCount, validProductId]);

  useEffect(() => {
    setSelectedVariantId(
      product ? (getStartingVariant(product)?.variantid ?? null) : null,
    );
  }, [product]);

  const selectedVariant =
    product?.variants.find(
      (variant) => variant.variantid === selectedVariantId,
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

    setSelectedVariantId(
      (exactVariant ?? matchingVariants[0])?.variantid ?? null,
    );
  };

  const handleAddToCart = (variant: ProductDetailsVariant) => {
    if (!product) return;
    showAppAlert(
      "Cart coming soon",
      `${product.name} (${variant.options.map((option) => option.value).join(", ")}) is ready to add once cart is available.`,
    );
  };

  const handleRetry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  const handleBuyNow = () => {
    showAppAlert(
      "Checkout coming soon",
      "Checkout will be available soon.",
    );
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
      onBuyNow={handleBuyNow}
      onGoHome={() => {
        blurFocusedWebElement();
        router.replace(AppRoutes.home);
      }}
    />
  );
};

export default ProductDetailsContainer;
