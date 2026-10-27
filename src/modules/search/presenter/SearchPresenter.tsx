import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import EmptyState from "@/components/common/EmptyState";
import SearchBar from "@/components/common/SearchBar";
import SearchCard from "@/components/product/SearchCard";
import type { Product } from "@/types/api/productList";
import { useAppTheme } from "@/utils/useTheme";

interface SearchPresenterProps {
  query: string;
  minSearchLength: number;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onQueryChange: (query: string) => void;
  onBack: () => void;
  onOpenProduct: (product: Product) => void;
  onRetry: () => void;
}

export default function SearchPresenter({
  query,
  minSearchLength,
  products,
  isLoading,
  error,
  onQueryChange,
  onBack,
  onOpenProduct,
  onRetry,
}: SearchPresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader onBack={onBack} title="Search" />

      <SearchBar
        accessibilityLabel="Search products and brands"
        autoFocus
        onChangeText={onQueryChange}
        onClear={() => onQueryChange("")}
        outlined
        placeholder="Search products and brands"
        style={styles.searchBar}
        value={query}
      />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={products}
        keyExtractor={(product) => String(product.id)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          query.trim().length < minSearchLength ? (
            <EmptyState
              fillAvailableSpace
              icon="search-outline"
              message={`Enter at least ${minSearchLength} characters to search.`}
              title="Keep typing"
            />
          ) : isLoading ? (
            <EmptyState fillAvailableSpace loading title="Searching products" />
          ) : error ? (
            <EmptyState
              fillAvailableSpace
              icon="alert-circle-outline"
              message={error}
              onRetry={onRetry}
              title="Unable to search products"
            />
          ) : (
            <EmptyState
              fillAvailableSpace
              icon="search-outline"
              message={`No products found for "${query.trim()}".`}
              title="No results"
            />
          )
        }
        renderItem={({ item }) => (
          <SearchCard product={item} onPress={onOpenProduct} />
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
    searchBar: {
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    listContent: {
      flexGrow: 1,
      padding: theme.spacing.md,
    },
    separator: {
      height: theme.spacing.sm,
    },
  });
