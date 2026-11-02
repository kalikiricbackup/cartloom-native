import { StatusBar } from "expo-status-bar";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import CustomButton from "@/components/common/CustomButton";
import EmptyState from "@/components/common/EmptyState";
import PageLoadingOverlay from "@/components/common/PageLoadingOverlay";
import CartItemCard from "@/components/product/CartItemCard";
import type { CartItem } from "@/services/api";
import type { Address } from "@/types/api/address";
import { useAppTheme } from "@/utils/useTheme";

interface CartPresenterProps {
  items: CartItem[];
  updatingItemId: number | null;
  isCartActionLoading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  onRetry: () => void;
  onSignIn: () => void;
  onQuantityChange: (item: CartItem, quantity: number) => void;
  onRemove: (item: CartItem) => void;
  onMoveToWishlist: (item: CartItem) => void;
  onCheckout: () => void;
  addresses: Address[];
  isAddressPickerVisible: boolean;
  isLoadingAddresses: boolean;
  isPlacingOrder: boolean;
  onSelectAddress: (address: Address) => void;
  onCloseAddressPicker: () => void;
  onAddAddress: () => void;
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

export default function CartPresenter({
  items,
  updatingItemId,
  isCartActionLoading,
  isLoading,
  isAuthenticated,
  error,
  onRetry,
  onSignIn,
  onQuantityChange,
  onRemove,
  onMoveToWishlist,
  onCheckout,
  addresses = [],
  isAddressPickerVisible = false,
  isLoadingAddresses = false,
  isPlacingOrder = false,
  onSelectAddress = () => {},
  onCloseAddressPicker = () => {},
  onAddAddress = () => {},
}: CartPresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const pricedItems = items.flatMap((item) => {
    const price = item.unitPrice ?? item.variant?.price;
    if (price === undefined) return [];
    const originalPrice = item.variant?.originalPrice ?? price;
    return [{ item, price, originalPrice }];
  });
  const subtotal = pricedItems.reduce(
    (total, { item, originalPrice }) => total + originalPrice * item.quantity,
    0,
  );
  const discount = pricedItems.reduce(
    (total, { item, price, originalPrice }) =>
      total + Math.max(originalPrice - price, 0) * item.quantity,
    0,
  );
  const total = Math.max(subtotal - discount, 0);
  const isPricingIncomplete = pricedItems.length !== items.length;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader title="My Cart" />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={items}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          items.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>My Cart</Text>
              <Text style={styles.itemCount}>
                ({items.reduce((count, item) => count + item.quantity, 0)} items)
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <EmptyState fillAvailableSpace loading title="Loading your cart" />
          ) : !isAuthenticated ? (
            <EmptyState
              fillAvailableSpace
              icon="cart-outline"
              message="Sign in to view the items in your cart."
              actionLabel="Sign In"
              onAction={onSignIn}
              title="Your cart is waiting"
            />
          ) : error ? (
            <EmptyState
              fillAvailableSpace
              icon="alert-circle-outline"
              message={error}
              onRetry={onRetry}
              title="Unable to load cart"
            />
          ) : (
            <EmptyState
              fillAvailableSpace
              icon="cart-outline"
              message="Products you add to your cart will appear here."
              title="Your cart is empty"
            />
          )
        }
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            isUpdating={updatingItemId === item.id}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            onMoveToWishlist={onMoveToWishlist}
          />
        )}
        ListFooterComponent={
          items.length > 0 ? (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Price Details</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                {isPricingIncomplete ? (
                  <Text style={styles.priceValue}>Loading...</Text>
                ) : (
                  <Text style={styles.priceValue}>{currency(subtotal)}</Text>
                )}
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={styles.discountValue}>
                  {isPricingIncomplete ? "—" : `-${currency(discount)}`}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Charges</Text>
                <Text style={styles.discountValue}>FREE</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                {isPricingIncomplete ? (
                  <Text style={styles.totalValue}>Loading...</Text>
                ) : (
                  <Text style={styles.totalValue}>{currency(total)}</Text>
                )}
              </View>
              <CustomButton
                disabled={isPricingIncomplete}
                onPress={onCheckout}
                style={styles.checkoutButton}
                title="Proceed to Checkout"
              />
            </View>
          ) : null
        }
      />
      <Modal
        animationType="slide"
        onRequestClose={onCloseAddressPicker}
        transparent
        visible={isAddressPickerVisible}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.addressSheet}>
            <Text style={styles.summaryTitle}>Choose a delivery address</Text>
            {isLoadingAddresses ? (
              <Text style={styles.addressHint}>Loading your addresses…</Text>
            ) : addresses.length === 0 ? (
              <Text style={styles.addressHint}>Add an address to place your order.</Text>
            ) : (
              <FlatList
                data={addresses}
                keyExtractor={(address) => String(address.id)}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                renderItem={({ item }) => {
                  const lines = Array.from(new Set([item.address, item.street, item.city, item.state].filter(Boolean))).join(", ");
                  return (
                    <Pressable
                      accessibilityRole="button"
                      disabled={isPlacingOrder}
                      onPress={() => onSelectAddress(item)}
                      style={styles.selectableAddress}
                    >
                      <Text style={styles.addressLabel}>{item.label || "Address"}</Text>
                      <Text style={styles.addressHint}>{[lines, item.pin].filter(Boolean).join(" • ")}</Text>
                    </Pressable>
                  );
                }}
              />
            )}
            {!isLoadingAddresses && addresses.length === 0 ? (
              <CustomButton onPress={onAddAddress} title="Add Address" />
            ) : null}
            <Pressable accessibilityRole="button" onPress={onCloseAddressPicker} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <PageLoadingOverlay visible={isCartActionLoading} />
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    listContent: {
      flexGrow: 1,
      padding: theme.spacing.md,
    },
    listHeader: {
      alignItems: "baseline",
      flexDirection: "row",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.bold,
    },
    itemCount: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    itemSeparator: {
      height: theme.spacing.sm,
    },
    summary: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
      padding: theme.spacing.md,
    },
    summaryTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.bold,
      marginBottom: theme.spacing.xs,
    },
    priceRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    priceLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    priceValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
    },
    discountValue: {
      color: theme.colors.discount,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
    },
    divider: {
      backgroundColor: theme.colors.border,
      height: StyleSheet.hairlineWidth,
      marginVertical: theme.spacing.xs,
    },
    totalRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xs,
    },
    totalLabel: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.bold,
    },
    totalValue: {
      color: theme.colors.price,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.bold,
    },
    checkoutButton: {
      marginTop: theme.spacing.xs,
    },
    modalBackdrop: {
      backgroundColor: "rgba(0,0,0,0.45)",
      flex: 1,
      justifyContent: "flex-end",
    },
    addressSheet: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      gap: theme.spacing.md,
      maxHeight: "75%",
      padding: theme.spacing.lg,
    },
    selectableAddress: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    addressLabel: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
    addressHint: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
    },
    cancelButton: {
      alignItems: "center",
      padding: theme.spacing.sm,
    },
    cancelText: {
      color: theme.colors.primary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
  });
