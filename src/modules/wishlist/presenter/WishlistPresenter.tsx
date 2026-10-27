import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import EmptyState from "@/components/common/EmptyState";
import WishlistItemCard from "@/components/product/WishlistItemCard";
import type { WishlistEntry } from "@/services/api";
import { useAppTheme } from "@/utils/useTheme";

interface WishlistPresenterProps {
  entries: WishlistEntry[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onBack: () => void;
  onOpenProduct: (productId: number) => void;
  onRemoveProduct: (entry: WishlistEntry) => void;
}

export default function WishlistPresenter({
  entries,
  isLoading,
  error,
  onRetry,
  onBack,
  onOpenProduct,
  onRemoveProduct,
}: WishlistPresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader onBack={onBack} title="My Wishlist" />

      {entries.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={entries}
          keyExtractor={(entry) =>
            String(
              entry.wishlist_item_id ??
                `${entry.product_id}:${entry.variant_id}`,
            )
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.productSeparator} />}
          renderItem={({ item }) => (
            <WishlistItemCard
              entry={item}
              onOpenProduct={onOpenProduct}
              onRemoveProduct={() => onRemoveProduct(item)}
            />
          )}
        />
      ) : (
        <EmptyState
          fillAvailableSpace
          loading={isLoading}
          icon={error ? "alert-circle-outline" : "heart-outline"}
          message={
            error
              ? error
              : isLoading
                ? undefined
                : "Save products you love and they will appear here."
          }
          onRetry={error ? onRetry : undefined}
          title={
            isLoading
              ? "Loading wishlist"
              : error
                ? "Unable to load wishlist"
                : "Your wishlist is empty"
          }
        />
      )}
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
