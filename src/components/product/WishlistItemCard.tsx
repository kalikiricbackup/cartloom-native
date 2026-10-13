import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { WishlistEntry } from "@/services/api";
import type { ProductDetails } from "@/types/api/productDetails";
import { useAppTheme } from "@/utils/useTheme";

interface WishlistItemCardProps {
  entry: WishlistEntry;
  product?: ProductDetails;
  isLoadingDetails: boolean;
  detailsError: string | null;
  isAddingToCart: boolean;
  onOpenProduct: (productId: number) => void;
  onRemoveProduct: (productId: number) => void;
  onAddToCart: (entry: WishlistEntry) => void;
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

export default function WishlistItemCard({
  entry,
  product,
  isLoadingDetails,
  detailsError,
  isAddingToCart,
  onOpenProduct,
  onRemoveProduct,
  onAddToCart,
}: WishlistItemCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const variant = product?.variants.find(
    (item) => item.variantid === entry.variant_id,
  );
  const imageUrl = variant?.images[0];
  const options = variant?.options.map((option) => option.value).join(", ");
  const productName = product?.name ?? `Product #${entry.product_id}`;

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
            {isLoadingDetails ? (
              <Text style={styles.meta}>Loading product details...</Text>
            ) : detailsError ? (
              <Text numberOfLines={1} style={styles.meta}>
                {detailsError}
              </Text>
            ) : (
              <>
                {options ? (
                  <Text numberOfLines={1} style={styles.meta}>
                    {options}
                  </Text>
                ) : null}
                {variant ? (
                  <Text style={styles.price}>{currency(variant.price)}</Text>
                ) : null}
                {product ? (
                  <View style={styles.ratingRow}>
                    <Ionicons
                      color={theme.colors.success}
                      name="star"
                      size={13}
                    />
                    <Text style={styles.rating}>
                      {product.rating.toFixed(1)} ({product.reviews})
                    </Text>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </Pressable>
        <Pressable
          accessibilityLabel={`Remove ${productName} from wishlist`}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => onRemoveProduct(entry.product_id)}
          style={styles.removeButton}
        >
          <Ionicons color={theme.colors.error} name="heart" size={20} />
        </Pressable>
      </View>
      <Pressable
        accessibilityLabel={`Move ${productName} to cart`}
        accessibilityRole="button"
        accessibilityState={{
          disabled: !variant || variant.stock <= 0 || isAddingToCart,
          busy: isAddingToCart,
        }}
        disabled={!variant || variant.stock <= 0 || isAddingToCart}
        onPress={() => onAddToCart(entry)}
        style={[
          styles.moveButton,
          (!variant || variant.stock <= 0) && styles.disabledButton,
        ]}
      >
        {isAddingToCart ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
        ) : (
          <Text style={styles.moveButtonText}>
            {variant && variant.stock <= 0 ? "Out of Stock" : "Move to Cart"}
          </Text>
        )}
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
    moveButton: {
      alignItems: "center",
      alignSelf: "flex-end",
      borderColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 36,
      minWidth: 128,
      paddingHorizontal: theme.spacing.md,
    },
    moveButtonText: {
      color: theme.colors.primary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });
