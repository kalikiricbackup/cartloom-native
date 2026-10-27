import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { WishlistEntry } from "@/services/api";
import { useAppTheme } from "@/utils/useTheme";

interface WishlistItemCardProps {
  entry: WishlistEntry;
  onOpenProduct: (productId: number) => void;
  onRemoveProduct: () => void;
}

export default function WishlistItemCard({
  entry,
  onOpenProduct,
  onRemoveProduct,
}: WishlistItemCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { product, variant } = entry;
  const productName = product?.name ?? `Product #${entry.product_id}`;
  const imageUrl = variant?.images[0];
  const options = variant?.options.map((option) => option.value).join(", ");

  return (
    <View style={styles.card}>
      <View style={styles.productRow}>
        <Pressable
          accessibilityLabel={`View ${productName} details`}
          accessibilityRole="button"
          onPress={() => onOpenProduct(entry.product_id)}
          style={styles.productButton}
        >
          <View style={styles.imageWrap}>
            {imageUrl ? (
              <Image
                accessibilityLabel={`${productName} product image`}
                contentFit="contain"
                source={{ uri: imageUrl }}
                style={styles.image}
              />
            ) : (
              <Ionicons
                color={theme.colors.primary}
                name="bag-handle-outline"
                size={26}
              />
            )}
          </View>
          <View style={styles.productInfo}>
            <Text numberOfLines={2} style={styles.productName}>
              {productName}
            </Text>
            {options ? (
              <Text numberOfLines={1} style={styles.meta}>
                {options}
              </Text>
            ) : null}
            {variant ? (
              <Text style={styles.price}>
                ₹{Math.round(variant.price).toLocaleString("en-IN")}
              </Text>
            ) : null}
            {product ? (
              <View style={styles.ratingRow}>
                <Ionicons color={theme.colors.success} name="star" size={13} />
                <Text style={styles.rating}>
                  {product.rating.toFixed(1)} ({product.reviews})
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
        <Pressable
          accessibilityLabel={`Remove ${productName} from wishlist`}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onRemoveProduct}
          style={styles.removeButton}
        >
          <Ionicons color={theme.colors.error} name="heart" size={20} />
        </Pressable>
      </View>
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
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
    productRow: {
      alignItems: "flex-start",
      flexDirection: "row",
    },
    productButton: {
      flex: 1,
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    imageWrap: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.sm,
      height: 88,
      justifyContent: "center",
      width: 72,
    },
    image: {
      height: "92%",
      width: "92%",
    },
    productInfo: {
      flex: 1,
      gap: 3,
      paddingTop: 2,
    },
    productName: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.semiBold,
    },
    meta: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.tiny,
    },
    price: {
      color: theme.colors.price,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.bold,
    },
    ratingRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 3,
    },
    rating: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.tiny,
    },
    removeButton: {
      alignItems: "center",
      height: 32,
      justifyContent: "center",
      width: 32,
    },
  });
