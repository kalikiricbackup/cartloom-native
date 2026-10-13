import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import EmptyState from "@/components/common/EmptyState";
import WishlistItemCard from "@/components/product/WishlistItemCard";
import type { WishlistEntry } from "@/services/api";
import type { ProductDetails } from "@/types/api/productDetails";
import { useAppTheme } from "@/utils/useTheme";

interface WishlistPresenterProps {
  entries: WishlistEntry[];
  productsById: Record<number, ProductDetails>;
  loadingProductIds: number[];
  productErrors: Record<number, string>;
  addingProductId: number | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onBack: () => void;
  onOpenProduct: (productId: number) => void;
  onRemoveProduct: (productId: number) => void;
  onAddToCart: (entry: WishlistEntry) => void;
}

export default function WishlistPresenter({
  entries,
  productsById,
  loadingProductIds,
  productErrors,
  addingProductId,
  isLoading,
  error,
  onRetry,
  onBack,
  onOpenProduct,
  onRemoveProduct,
  onAddToCart,
}: WishlistPresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader onBack={onBack} title="My Wishlist" />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={entries}
        keyExtractor={(entry) => `${entry.product_id}:${entry.variant_id}`}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.productSeparator} />}
        ListEmptyComponent={
          isLoading ? (
            <EmptyState fillAvailableSpace loading title="Loading wishlist" />
          ) : error ? (
            <EmptyState
              fillAvailableSpace
              icon="alert-circle-outline"
              message={error}
              onRetry={onRetry}
              title="Unable to load wishlist"
            />
          ) : (
            <EmptyState
              fillAvailableSpace
              icon="heart-outline"
              message="Save products you love and they will appear here."
              title="Your wishlist is empty"
            />
          )
        }
        renderItem={({ item }) => (
          <WishlistItemCard
            entry={item}
            product={productsById[item.product_id]}
            isLoadingDetails={loadingProductIds.includes(item.product_id)}
            detailsError={productErrors[item.product_id] ?? null}
            isAddingToCart={addingProductId === item.product_id}
            onOpenProduct={onOpenProduct}
            onRemoveProduct={onRemoveProduct}
            onAddToCart={onAddToCart}
          />
        )}
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
      flexGrow: 1,
      padding: theme.spacing.md,
    },
    productSeparator: {
      height: theme.spacing.md,
    },
  });
