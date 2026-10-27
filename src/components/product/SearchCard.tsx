import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Product } from "@/types/api/productList";
import { useAppTheme } from "@/utils/useTheme";

interface SearchCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

export default function SearchCard({ product, onPress }: SearchCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [imageFailed, setImageFailed] = useState(false);
  const variant = product.variants[0];
  const imageUrl = variant?.images[0];

  return (
    <Pressable
      accessibilityLabel={`View ${product.name} details`}
      accessibilityRole="button"
      onPress={() => onPress(product)}
      style={styles.card}
    >
      <View style={styles.imageWrap}>
        {imageUrl && !imageFailed ? (
          <Image
            accessibilityLabel={`${product.name} product image`}
            contentFit="contain"
            onError={() => setImageFailed(true)}
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : (
          <Ionicons
            color={theme.colors.textTertiary}
            name="image-outline"
            size={34}
          />
        )}
      </View>
      <View style={styles.productInfo}>
        <Text numberOfLines={2} style={styles.productName}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={styles.brand}>
          {product.brand}
        </Text>
        {variant ? (
          <Text style={styles.price}>{currency(variant.price)}</Text>
        ) : null}
        <View style={styles.ratingRow}>
          <Ionicons color={theme.colors.success} name="star" size={14} />
          <Text style={styles.rating}>
            {product.rating.toFixed(1)} ({product.reviews})
          </Text>
        </View>
      </View>
      <Ionicons
        color={theme.colors.textTertiary}
        name="chevron-forward"
        size={18}
      />
    </Pressable>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    card: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      flexDirection: "row",
      gap: theme.spacing.md,
      minHeight: 112,
      padding: theme.spacing.sm,
    },
    imageWrap: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.sm,
      height: 88,
      justifyContent: "center",
      overflow: "hidden",
      width: 88,
    },
    image: {
      height: "90%",
      width: "90%",
    },
    productInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    productName: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
    brand: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    price: {
      color: theme.colors.price,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.bold,
    },
    ratingRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
    },
    rating: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
  });
