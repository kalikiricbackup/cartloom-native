import { Ionicons } from "@react-native-vector-icons/ionicons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import EmptyState from "@/components/common/EmptyState";
import LoadMoreFooter from "@/components/common/LoadMoreFooter";
import MultiSectionFilterSheet from "@/components/common/MultiSectionFilterSheet";
import PageLoadingOverlay from "@/components/common/PageLoadingOverlay";
import SearchBar from "@/components/common/SearchBar";
import SortOptionsModal from "@/components/common/SortOptionsModal";
import ProductItemCard from "@/components/product/ProductItemCard";
import { useToast } from "@/contexts/ToastContext";
import type { Product } from "@/types/api/productList";
import { useAppTheme } from "@/utils/useTheme";

export interface ProductFilters {
  brand: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
}

export type ProductSort = "popularity" | "price-low" | "price-high" | "rating";

interface ProductListPresenterProps {
  categories: string[];
  brands: string[];
  searchText: string;
  selectedCategory: string;
  draftFilters: ProductFilters;
  maxPriceLimit: number;
  filtersVisible: boolean;
  sortVisible: boolean;
  sort: ProductSort;
  filterCount: number;
  products: Product[];
  totalCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  canLoadMore: boolean;
  error: string | null;
  favoriteIds: number[];
  isAddingToCart: boolean;
  onBack: () => void;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onCategorySelect: (category: string) => void;
  onOpenFilters: () => void;
  onCloseFilters: () => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onSelectDraftFilter: (sectionId: string, value: string) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onRatingChange: (value: number) => void;
  onOpenSort: () => void;
  onCloseSort: () => void;
  onSelectSort: (sort: ProductSort) => void;
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (product: Product) => Promise<void>;
  onAddToCart: (product: Product) => void;
}

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price-low", label: "Price -- Low to High" },
  { value: "price-high", label: "Price -- High to Low" },
  { value: "rating", label: "Customer Rating" },
] satisfies { value: ProductSort; label: string }[];

export default function ProductListPresenter({
  categories,
  brands,
  searchText,
  selectedCategory,
  draftFilters,
  maxPriceLimit,
  filtersVisible,
  sortVisible,
  sort,
  filterCount,
  products,
  totalCount,
  isLoading,
  isLoadingMore,
  canLoadMore,
  error,
  favoriteIds,
  isAddingToCart,
  onBack,
  onSearchChange,
  onSearchClear,
  onRetry,
  onLoadMore,
  onCategorySelect,
  onOpenFilters,
  onCloseFilters,
  onApplyFilters,
  onClearFilters,
  onSelectDraftFilter,
  onMinPriceChange,
  onMaxPriceChange,
  onRatingChange,
  onOpenSort,
  onCloseSort,
  onSelectSort,
  onSelectProduct,
  onToggleFavorite,
  onAddToCart,
}: ProductListPresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const productListRef = useRef<FlatList<Product>>(null);
  const filterButtonRef = useRef<View>(null);
  const sortButtonRef = useRef<View>(null);
  const { showToast } = useToast();
  const sortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? "Popularity";

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      productListRef.current?.scrollToOffset({ offset: 0, animated: false });
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedCategory]);

  const toggleFavorite = (product: Product, isFavorite: boolean) => {
    void onToggleFavorite(product)
      .then(() => {
        showToast({
          message: `${product.name} ${isFavorite ? "removed from" : "added to"} wishlist`,
          type: "success",
        });
      })
      .catch((error: unknown) => {
        showToast({
          message:
            typeof error === "string"
              ? error
              : error instanceof Error
                ? error.message
                : "Unable to update your wishlist.",
          type: "error",
        });
      });
  };

  const handleOpenFilters = () => {
    filterButtonRef.current?.blur();
    onOpenFilters();
  };

  const handleOpenSort = () => {
    sortButtonRef.current?.blur();
    onOpenSort();
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader onBack={onBack} title="Products" />

      <FlatList
        ref={productListRef}
        data={products}
        keyExtractor={(product) => String(product.id)}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraData={favoriteIds}
        onEndReached={() => {
          if (canLoadMore && !isLoadingMore) onLoadMore();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <SearchBar
              accessibilityLabel="Search products"
              onChangeText={onSearchChange}
              onClear={onSearchClear}
              outlined
              placeholder="Search products and descriptions"
              style={styles.searchBar}
              value={searchText}
            />
            <FlatList
              contentContainerStyle={styles.categoryList}
              data={["All", ...categories]}
              horizontal
              keyExtractor={(category) => category}
              renderItem={({ item: category }) => {
                const selected = category === selectedCategory;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => onCategorySelect(category)}
                    style={[
                      styles.categoryChip,
                      selected && styles.categoryChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              }}
              showsHorizontalScrollIndicator={false}
            />

            <View style={styles.controls}>
              <Pressable
                accessibilityRole="button"
                onPress={handleOpenFilters}
                ref={filterButtonRef}
                style={styles.filterButton}
              >
                <Ionicons
                  name="options-outline"
                  size={17}
                  color={theme.colors.primary}
                />
                <Text style={styles.filterButtonText}>Filters</Text>
                {filterCount > 0 && (
                  <View style={styles.filterCount}>
                    <Text style={styles.filterCountText}>{filterCount}</Text>
                  </View>
                )}
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleOpenSort}
                ref={sortButtonRef}
                style={styles.sortButton}
              >
                <Text style={styles.sortPrefix}>Sort by:</Text>
                <Text numberOfLines={1} style={styles.sortLabel}>
                  {sortLabel}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={15}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            </View>

            <Text style={styles.resultCount}>
              {totalCount} {totalCount === 1 ? "product" : "products"}
            </Text>
          </>
        }
        renderItem={({ item: product }) => (
          <ProductItemCard
            favorite={favoriteIds.includes(product.id)}
            isAddingToCart={isAddingToCart}
            onAddToCart={onAddToCart}
            onSelect={onSelectProduct}
            onToggleFavorite={(selectedProduct) =>
              toggleFavorite(
                selectedProduct,
                favoriteIds.includes(selectedProduct.id),
              )
            }
            product={product}
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.productRowSeparator} />
        )}
        ListEmptyComponent={
          isLoading ? (
            <EmptyState loading title="Loading products" />
          ) : (
            <EmptyState
              icon={error ? "alert-circle-outline" : "search-outline"}
              message={error ?? "Try a different category or brand."}
              onRetry={error ? onRetry : undefined}
              title={error ? "Unable to load products" : "No products found"}
            />
          )
        }
        ListFooterComponent={
          products.length > 0 ? (
            <LoadMoreFooter
              error={error}
              loading={isLoadingMore}
              onRetry={onRetry}
            />
          ) : null
        }
      />

      <MultiSectionFilterSheet
        visible={filtersVisible}
        title="Filters"
        sections={[
          {
            id: "brand",
            title: "Brand",
            options: brands,
            selectedValue: draftFilters.brand,
            unselectedLabel: "All brands",
          },
        ]}
        minPrice={Number(draftFilters.minPrice) || 0}
        maxPrice={
          draftFilters.maxPrice === ""
            ? maxPriceLimit
            : Number(draftFilters.maxPrice)
        }
        maxPriceLimit={maxPriceLimit}
        rating={Number(draftFilters.rating) || 0}
        onClose={onCloseFilters}
        onSelect={onSelectDraftFilter}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
        onRatingChange={onRatingChange}
        onClear={onClearFilters}
        onApply={onApplyFilters}
      />

      <SortOptionsModal
        visible={sortVisible}
        options={sortOptions}
        selectedValue={sort}
        onClose={onCloseSort}
        onSelect={onSelectSort}
      />

      <PageLoadingOverlay visible={isAddingToCart} />
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    content: { paddingBottom: theme.spacing.lg },
    searchBar: {
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    categoryList: {
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    categoryChip: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.round,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 34,
      paddingHorizontal: theme.spacing.md,
    },
    categoryChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.medium,
    },
    categoryChipTextSelected: {
      color: theme.colors.onPrimary,
      fontWeight: theme.typography.weight.semiBold,
    },
    controls: {
      alignItems: "center",
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 48,
      paddingHorizontal: theme.spacing.md,
    },
    filterButton: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radius.round,
      borderWidth: 1,
      flexDirection: "row",
      gap: theme.spacing.xs,
      minHeight: 32,
      paddingHorizontal: theme.spacing.sm,
    },
    filterButtonText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.medium,
    },
    filterCount: {
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.round,
      height: 18,
      justifyContent: "center",
      minWidth: 18,
      paddingHorizontal: 3,
    },
    filterCountText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.tiny,
      fontWeight: theme.typography.weight.bold,
    },
    sortButton: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
      maxWidth: "65%",
    },
    sortPrefix: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
    },
    sortLabel: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
      flexShrink: 1,
    },
    resultCount: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    productRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
    },
    productRowSeparator: {
      height: theme.spacing.sm,
    },
  });
