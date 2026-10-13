import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import EmptyState from "@/components/common/EmptyState";
import SearchBar from "@/components/common/SearchBar";
import type { Product } from "@/types/api/productList";
import { useAppTheme } from "@/utils/useTheme";

interface SearchPresenterProps {
  query: string;
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
          query.trim().length === 0 ? (
            <EmptyState
              fillAvailableSpace
              icon="search-outline"
              message="Search by product name or description."
              title="Find a product"
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
          <SearchResultItem product={item} onPress={onOpenProduct} />
        )}
      />
    </SafeAreaView>
  );
}

function SearchResultItem({
  product,
  onPress,
}: {
  product: Product;
  onPress: (product: Product) => void;
}) {
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
      style={styles.resultCard}
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
          <Text style={styles.price}>
            ₹{Math.round(variant.price).toLocaleString("en-IN")}
          </Text>
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
    resultCard: {
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
