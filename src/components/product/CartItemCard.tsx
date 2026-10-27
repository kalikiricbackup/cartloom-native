import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MAX_CART_QUANTITY, type CartItem } from "@/services/api";
import { useAppTheme } from "@/utils/useTheme";

interface CartItemCardProps {
  item: CartItem;
  isUpdating: boolean;
  onQuantityChange: (item: CartItem, quantity: number) => void;
  onRemove: (item: CartItem) => void;
  onMoveToWishlist: (item: CartItem) => void;
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

export default function CartItemCard({
  item,
  isUpdating,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
}: CartItemCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const variant = item.variant;
  const productName = item.productName ?? `Product #${item.productId}`;
  const price = item.unitPrice ?? variant?.price;
  const options = variant?.options.map((option) => option.value).join(", ");

  return (
    <View style={styles.card}>
      <View style={styles.productRow}>
        <View style={styles.imageWrap}>
          {variant?.images[0] ? (
            <Image
              accessibilityLabel={`${productName} product image`}
              contentFit="contain"
              source={{ uri: variant.images[0] }}
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
          {price !== undefined ? (
            <Text style={styles.price}>{currency(price)}</Text>
          ) : null}
        </View>
        <Pressable
          accessibilityLabel={`Remove ${productName} from cart`}
          accessibilityRole="button"
          accessibilityState={{ disabled: isUpdating, busy: isUpdating }}
          disabled={isUpdating}
          hitSlop={8}
          onPress={() => onRemove(item)}
          style={styles.removeIcon}
        >
            <Ionicons color={theme.colors.error} name="trash-outline" size={19} />
        </Pressable>
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.quantityControl}>
          <Pressable
            accessibilityLabel={`Decrease ${productName} quantity`}
            accessibilityRole="button"
            accessibilityState={{
              disabled: item.quantity <= 1 || isUpdating,
              busy: isUpdating,
            }}
            disabled={item.quantity <= 1 || isUpdating}
            onPress={() => onQuantityChange(item, item.quantity - 1)}
            style={[
              styles.quantityButton,
              (item.quantity <= 1 || isUpdating) && styles.disabledButton,
            ]}
          >
            <Ionicons
              color={theme.colors.textPrimary}
              name="remove"
              size={17}
            />
          </Pressable>
          <Text accessibilityLabel={`Quantity ${item.quantity}`} style={styles.quantity}>
            {item.quantity}
          </Text>
          <Pressable
            accessibilityLabel={`Increase ${productName} quantity`}
            accessibilityRole="button"
            accessibilityState={{
              disabled:
                !variant ||
                variant.stock === undefined ||
                item.quantity >= MAX_CART_QUANTITY ||
                item.quantity >= variant.stock ||
                isUpdating,
              busy: isUpdating,
            }}
            disabled={
              !variant ||
              variant.stock === undefined ||
              item.quantity >= MAX_CART_QUANTITY ||
              item.quantity >= variant.stock ||
              isUpdating
            }
            onPress={() => onQuantityChange(item, item.quantity + 1)}
            style={[
              styles.quantityButton,
              (!variant ||
                variant.stock === undefined ||
                item.quantity >= MAX_CART_QUANTITY ||
                item.quantity >= variant.stock ||
                isUpdating) &&
                styles.disabledButton,
            ]}
          >
            <Ionicons color={theme.colors.primary} name="add" size={17} />
          </Pressable>
        </View>

        <Pressable
          accessibilityLabel={`Save ${productName} for later`}
          accessibilityRole="button"
          accessibilityState={{ disabled: isUpdating, busy: isUpdating }}
          disabled={isUpdating}
          onPress={() => onMoveToWishlist(item)}
          style={styles.saveButton}
        >
          <Ionicons color={theme.colors.primary} name="heart-outline" size={16} />
          <Text style={styles.saveText}>Save for Later</Text>
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
      gap: theme.spacing.sm,
    },
    imageWrap: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.sm,
      height: 76,
      justifyContent: "center",
      width: 68,
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
    removeIcon: {
      alignItems: "center",
      height: 30,
      justifyContent: "center",
      width: 30,
    },
    actionsRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 68 + theme.spacing.sm,
    },
    quantityControl: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexDirection: "row",
      height: 34,
    },
    quantityButton: {
      alignItems: "center",
      height: 32,
      justifyContent: "center",
      width: 32,
    },
    quantity: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.semiBold,
      minWidth: 26,
      textAlign: "center",
    },
    saveButton: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
      minHeight: 36,
      paddingHorizontal: theme.spacing.xs,
    },
    saveText: {
      color: theme.colors.primary,
      fontSize: theme.typography.tiny,
      fontWeight: theme.typography.weight.semiBold,
    },
    disabledButton: {
      opacity: 0.45,
    },
  });
