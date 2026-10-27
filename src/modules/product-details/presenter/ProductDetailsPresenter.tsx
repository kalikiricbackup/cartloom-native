import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import CustomButton from "@/components/common/CustomButton";
import EmptyState from "@/components/common/EmptyState";
import PageLoadingOverlay from "@/components/common/PageLoadingOverlay";
import ProductDetailsCard from "@/components/product/ProductDetailsCard";
import type {
  ProductDetails,
  ProductDetailsVariant,
} from "@/types/api/productDetails";
import { useAppTheme } from "@/utils/useTheme";

interface ProductDetailsPresenterProps {
  product: ProductDetails | undefined;
  selectedVariant: ProductDetailsVariant | undefined;
  isLoading: boolean;
  isAddingToCart: boolean;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
  onOptionSelect: (type: string, value: string) => void;
  onAddToCart: (variant: ProductDetailsVariant) => void;
  onBuyNow: () => void;
  onGoHome: () => void;
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

const ProductDetailsPresenter = ({
  product,
  selectedVariant,
  isLoading,
  isAddingToCart,
  error,
  onRetry,
  onBack,
  onOptionSelect,
  onAddToCart,
  onBuyNow,
  onGoHome,
}: ProductDetailsPresenterProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth =
    Platform.OS === "web" && typeof window !== "undefined"
      ? window.innerWidth
      : windowWidth;
  const imageListRef = useRef<ScrollView>(null);
  const [imagePage, setImagePage] = useState<{
    variantId: string | undefined;
    index: number;
  }>({ variantId: selectedVariant?.variantid, index: 0 });
  const activeImageIndex =
    imagePage.variantId === selectedVariant?.variantid ? imagePage.index : 0;
  const images = selectedVariant?.images ?? [];

  useEffect(() => {
    imageListRef.current?.scrollTo({ x: 0, animated: false });
  }, [selectedVariant?.variantid]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar style="dark" />
        <EmptyState
          fillAvailableSpace
          loading
          title="Loading product details..."
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar style="dark" />
        <EmptyState
          actionLabel="Continue shopping"
          fillAvailableSpace
          icon="alert-circle-outline"
          message={error}
          onAction={onGoHome}
          onRetry={onRetry}
          title="Could not load product"
        />
      </SafeAreaView>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar style="dark" />
        <EmptyState
          actionLabel="Continue shopping"
          fillAvailableSpace
          icon="bag-outline"
          message="This product may no longer be available."
          onAction={onGoHome}
          title="Product not found"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="light" />
      <AppHeader
        onBack={onBack}
        rightActions={[
          {
            accessibilityLabel: "Share product",
            icon: "share-social-outline",
            onPress: () =>
              Share.share({
                message: `${product.name} - ${currency(selectedVariant.price)}`,
              }),
          },
        ]}
        title={product.category}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Home</Text>
          <Ionicons
            color={theme.colors.textTertiary}
            name="chevron-forward"
            size={13}
          />
          <Text style={styles.breadcrumbText}>{product.category}</Text>
          <Ionicons
            color={theme.colors.textTertiary}
            name="chevron-forward"
            size={13}
          />
          <Text numberOfLines={1} style={styles.breadcrumbCurrent}>
            {product.name}
          </Text>
        </View>

        <View style={styles.gallery}>
          {images.length > 0 ? (
            <ScrollView
              accessibilityLabel={`${product.name} image gallery`}
              contentContainerStyle={styles.imageScrollerContent}
              directionalLockEnabled
              horizontal
              nestedScrollEnabled
              onMomentumScrollEnd={(event) => {
                if (imageWidth > 0) {
                  setImagePage({
                    variantId: selectedVariant.variantid,
                    index: Math.round(
                      event.nativeEvent.contentOffset.x / imageWidth,
                    ),
                  });
                }
              }}
              onScroll={(event) => {
                if (imageWidth > 0) {
                  setImagePage({
                    variantId: selectedVariant.variantid,
                    index: Math.round(
                      event.nativeEvent.contentOffset.x / imageWidth,
                    ),
                  });
                }
              }}
              pagingEnabled
              ref={imageListRef}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              style={[styles.imageScroller, { width: imageWidth }]}
            >
              {images.map((image, index) => (
                <View
                  key={`${image}-${index}`}
                  style={[styles.imageSlide, { width: imageWidth }]}
                >
                  <Image
                    accessibilityLabel={`${product.name} product image ${index + 1}`}
                    contentFit="contain"
                    source={{ uri: image }}
                    style={styles.productImage}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                color={theme.colors.textTertiary}
                name="image-outline"
                size={56}
              />
            </View>
          )}
          {product.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          ) : null}
          {images.length > 1 ? (
            <View accessibilityLabel="Product image pages" style={styles.dots}>
              {images.map((image, index) => (
                <Pressable
                  accessibilityLabel={`Product image ${index + 1}${index === activeImageIndex ? ", current" : ""}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: index === activeImageIndex }}
                  key={`${image}-dot-${index}`}
                  onPress={() => {
                    imageListRef.current?.scrollTo({
                      x: imageWidth * index,
                      animated: true,
                    });
                    setImagePage({
                      variantId: selectedVariant.variantid,
                      index,
                    });
                  }}
                  style={[
                    styles.dot,
                    index === activeImageIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          ) : null}
        </View>

        <ProductDetailsCard
          onOptionSelect={onOptionSelect}
          product={product}
          selectedVariant={selectedVariant}
        />
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          accessibilityRole="button"
          disabled={selectedVariant.stock <= 0}
          onPress={onBuyNow}
          style={[
            styles.buyNowButton,
            selectedVariant.stock <= 0 && styles.disabledButton,
          ]}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </Pressable>
        <CustomButton
          disabled={selectedVariant.stock <= 0 || isAddingToCart}
          onPress={() => onAddToCart(selectedVariant)}
          style={styles.addToCartButton}
          title="Add to Cart"
        />
      </View>
      <PageLoadingOverlay visible={isAddingToCart} />
    </SafeAreaView>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      paddingBottom: theme.spacing.xl,
    },
    breadcrumb: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    breadcrumbText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    breadcrumbCurrent: {
      color: theme.colors.textPrimary,
      flexShrink: 1,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.medium,
    },
    gallery: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      height: 340,
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },
    productImage: {
      height: 300,
      width: "100%",
    },
    imageScroller: {
      width: "100%",
    },
    imageScrollerContent: {
      flexDirection: "row",
      width: "100%",
    },
    imageSlide: {
      flexShrink: 0,
    },
    imagePlaceholder: {
      alignItems: "center",
      height: 300,
      justifyContent: "center",
      width: "100%",
    },
    badge: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.sm,
      left: theme.spacing.lg,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      position: "absolute",
      top: theme.spacing.md,
    },
    badgeText: {
      color: theme.colors.primaryDark,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.bold,
    },
    dots: {
      alignItems: "center",
      bottom: theme.spacing.md,
      flexDirection: "row",
      gap: theme.spacing.sm,
      justifyContent: "center",
      left: 0,
      position: "absolute",
      right: 0,
    },
    dot: {
      backgroundColor: theme.colors.border,
      borderRadius: 5,
      height: 8,
      width: 8,
    },
    activeDot: {
      backgroundColor: theme.colors.primary,
      width: 20,
    },
    actionBar: {
      backgroundColor: theme.colors.card,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      flexDirection: "row",
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    buyNowButton: {
      alignItems: "center",
      borderColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flex: 1,
      justifyContent: "center",
      minHeight: 48,
    },
    buyNowText: {
      color: theme.colors.primary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.semiBold,
    },
    addToCartButton: {
      flex: 1,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

export default ProductDetailsPresenter;
