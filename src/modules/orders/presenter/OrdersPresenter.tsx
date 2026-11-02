import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import CustomButton from "@/components/common/CustomButton";
import EmptyState from "@/components/common/EmptyState";
import type { OrderHistoryItem } from "@/services/api";
import { useAppTheme } from "@/utils/useTheme";

interface OrdersPresenterProps {
  orders: OrderHistoryItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMoreError: string | null;
  hasMore: boolean;
  onBack: () => void;
  onRetry: () => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const formatCurrency = (amount: string) => {
  const value = Number(amount);
  return Number.isFinite(value)
    ? `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
    : `₹${amount}`;
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

export default function OrdersPresenter({
  orders,
  isLoading,
  isRefreshing,
  isLoadingMore,
  error,
  loadMoreError,
  hasMore,
  onBack,
  onRetry,
  onRefresh,
  onLoadMore,
}: OrdersPresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const renderOrder = ({ item }: { item: OrderHistoryItem }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeading}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
        </View>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      <View style={styles.divider} />

      {item.items.map((orderItem) => (
        <View key={orderItem.id} style={styles.itemRow}>
          <View style={styles.itemDescription}>
            <Text style={styles.productName}>{orderItem.product_name}</Text>
            <Text style={styles.itemMeta}>
              Qty {orderItem.quantity} · {orderItem.variant_id}
            </Text>
          </View>
          <Text style={styles.itemPrice}>{formatCurrency(orderItem.line_total)}</Text>
        </View>
      ))}

      {item.shipping_address ? (
        <View style={styles.shippingBlock}>
          <Text style={styles.shippingLabel}>Delivering to</Text>
          <Text style={styles.shippingAddress}>
            {[item.shipping_address, item.shipping_pin].filter(Boolean).join(" · ")}
          </Text>
        </View>
      ) : null}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Order total</Text>
        <Text style={styles.totalAmount}>{formatCurrency(item.total_amount)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader onBack={onBack} title="My Orders" />
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          orders.length === 0 && styles.emptyListContent,
        ]}
        data={orders}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        onEndReached={hasMore ? onLoadMore : undefined}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <EmptyState fillAvailableSpace loading title="Loading your orders" />
          ) : error ? (
            <EmptyState
              fillAvailableSpace
              icon="alert-circle-outline"
              message={error}
              onRetry={onRetry}
              title="Unable to load orders"
            />
          ) : (
            <EmptyState
              fillAvailableSpace
              icon="receipt-outline"
              message="Orders you place will appear here."
              title="No orders yet"
            />
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              color={theme.colors.primary}
              size="small"
              style={styles.listFooter}
            />
          ) : loadMoreError ? (
            <View style={styles.listFooter}>
              <Text style={styles.loadMoreError}>{loadMoreError}</Text>
              <CustomButton title="Try again" onPress={onLoadMore} />
            </View>
          ) : null
        }
      />
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
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    emptyListContent: {
      flexGrow: 1,
    },
    itemSeparator: {
      height: theme.spacing.md,
    },
    orderCard: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    orderHeader: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: theme.spacing.sm,
      justifyContent: "space-between",
    },
    orderHeading: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    orderId: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
    orderDate: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    status: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.round,
      color: theme.colors.primary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
      overflow: "hidden",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      textTransform: "capitalize",
    },
    divider: {
      backgroundColor: theme.colors.border,
      height: StyleSheet.hairlineWidth,
      marginVertical: theme.spacing.xs,
    },
    itemRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: theme.spacing.sm,
      justifyContent: "space-between",
    },
    itemDescription: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    productName: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
    },
    itemMeta: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    itemPrice: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
    },
    shippingBlock: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.sm,
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
      padding: theme.spacing.sm,
    },
    shippingLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
    },
    shippingAddress: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
    },
    totalRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.xs,
    },
    totalLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
    },
    totalAmount: {
      color: theme.colors.price,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.bold,
    },
    listFooter: {
      alignItems: "center",
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.lg,
    },
    loadMoreError: {
      color: theme.colors.error,
      fontSize: theme.typography.bodySmall,
      textAlign: "center",
    },
  });
