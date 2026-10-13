import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Product } from "@/types/api/productList";
import { useAppTheme } from "@/utils/useTheme";

interface ProductItemCardProps {
  product: Product;
  favorite: boolean;
  onSelect: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

export default function ProductItemCard({
  product,
  favorite,
  onSelect,
  onToggleFavorite,
  onAddToCart,
}: ProductItemCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const imageButtonRef = useRef<View>(null);
  const nameButtonRef = useRef<View>(null);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const variant = product.variants.reduce((lowest, candidate) =>
    candidate.price < lowest.price ? candidate : lowest,
  );
  const imageUrl = variant.images[0];
  const imageFailed = imageUrl === failedImageUrl;
  const discount =
    variant.originalPrice > variant.price
      ? Math.round(
          ((variant.originalPrice - variant.price) / variant.originalPrice) *
            100,
        )
      : 0;

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Pressable
          accessibilityLabel={`View ${product.name} details`}
          accessibilityRole="button"
          onPress={() => {
            imageButtonRef.current?.blur();
            onSelect(product);
          }}
          ref={imageButtonRef}
          style={styles.imagePressable}
        >
          {imageUrl && !imageFailed ? (
            <Image
              accessibilityLabel={`${product.name} product image`}
              contentFit="contain"
              onError={() => setFailedImageUrl(imageUrl)}
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          ) : (
            <Ionicons
              color={theme.colors.primaryDark}
              name="image-outline"
              size={42}
            />
          )}
        </Pressable>
        {product.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : null}
        <Pressable
          accessibilityLabel={favorite ? "Remove from wishlist" : "Add to wishlist"}
          accessibilityRole="button"
          onPress={() => onToggleFavorite(product)}
          style={styles.favoriteButton}
        >
          <Ionicons
            color={theme.colors.error}
            name={favorite ? "heart" : "heart-outline"}
            size={17}
          />
        </Pressable>
      </View>
      <Pressable
        accessibilityLabel={`View ${product.name} details`}
        accessibilityRole="button"
        onPress={() => {
          nameButtonRef.current?.blur();
          onSelect(product);
        }}
        ref={nameButtonRef}
      >
        <Text numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text numberOfLines={1} style={styles.price}>
            {currency(variant.price)}
          </Text>
          {variant.originalPrice > variant.price ? (
            <Text numberOfLines={1} style={styles.originalPrice}>
              {currency(variant.originalPrice)}
            </Text>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          <View style={styles.rating}>
            <Ionicons
              color={theme.colors.success}
              name="star"
              size={13}
            />
            <Text style={styles.ratingText}>
              {product.rating.toFixed(1)} ({product.reviews})
            </Text>
          </View>
          {discount > 0 ? (
            <Text style={styles.discount}>{discount}% off</Text>
          ) : null}
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => onAddToCart(product)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      marginBottom: theme.spacing.xs,
      overflow: "hidden",
      padding: theme.spacing.sm,
      width: "48.5%",
    },
    imageWrap: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.sm,
      height: 132,
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    },
    imagePressable: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      width: "100%",
    },
    image: { height: "92%", width: "92%" },
    badge: {
      backgroundColor: theme.colors.secondary,
      borderBottomRightRadius: theme.radius.xs,
      left: 0,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 3,
      position: "absolute",
      top: 0,
    },
    badgeText: {
      color: theme.colors.onPrimary,
      fontSize: 8,
      fontWeight: theme.typography.weight.bold,
    },
    favoriteButton: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.round,
      height: 30,
      justifyContent: "center",
      position: "absolute",
      right: theme.spacing.xs,
      top: theme.spacing.xs,
      width: 30,
    },
    name: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
      lineHeight: theme.typography.lineHeight.bodySmall,
      marginTop: theme.spacing.sm,
      minHeight: 40,
    },
    priceRow: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    price: {
      color: theme.colors.price,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.bold,
      flexShrink: 1,
    },
    originalPrice: {
      color: theme.colors.textTertiary,
      fontSize: theme.typography.tiny,
      textDecorationLine: "line-through",
    },
    metaRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.xs,
      minHeight: 18,
    },
    rating: { alignItems: "center", flexDirection: "row", gap: 3 },
    ratingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.tiny,
    },
    discount: {
      color: theme.colors.discount,
      fontSize: theme.typography.tiny,
      fontWeight: theme.typography.weight.semiBold,
    },
    addButton: {
      alignItems: "center",
      borderColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      justifyContent: "center",
      marginTop: theme.spacing.sm,
      minHeight: 35,
    },
    addButtonText: {
      color: theme.colors.primary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
    },
  });
