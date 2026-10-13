import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { ComponentProps } from "react";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/common/AppHeader";
import CustomButton from "@/components/common/CustomButton";
import SearchBar from "@/components/common/SearchBar";
import type { HomeBestDeal, HomeCategory } from "@/types/api/home";
import { useAppTheme } from "@/utils/useTheme";

interface HomePresenterProps {
  categories: HomeCategory[];
  featuredProducts: HomeBestDeal[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  onSearchPress: () => void;
  onCategorySelect: (category: string) => void;
  onSeeAllCategories: () => void;
  onViewAllDeals: () => void;
  onSelectProduct: (productId: number) => void;
  onRetry: () => void;
}

const categoryIcons: Record<string, ComponentProps<typeof Ionicons>["name"]> = {
  mobiles: "phone-portrait-outline",
  fashion: "shirt-outline",
  electronics: "laptop-outline",
  home: "home-outline",
  beauty: "color-palette-outline",
  appliances: "tv-outline",
  "sports-fitness": "barbell-outline",
  toys: "game-controller-outline",
} as const;

function CategoryArtwork({
  iconUrl,
  fallbackIcon,
  selected,
}: {
  iconUrl: string;
  fallbackIcon: ComponentProps<typeof Ionicons>["name"];
  selected: boolean;
}) {
  const theme = useAppTheme();
  const [imageFailed, setImageFailed] = useState(false);

  if (iconUrl && !imageFailed) {
    return (
      <Image
        accessibilityLabel="Category icon"
        contentFit="contain"
        onError={() => setImageFailed(true)}
        source={{ uri: iconUrl }}
        style={{ height: 28, width: 28 }}
      />
    );
  }

  return (
    <Ionicons
      name={fallbackIcon}
      size={23}
      color={selected ? theme.colors.primary : theme.colors.textSecondary}
    />
  );
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

export default function HomePresenter({
  categories,
  featuredProducts,
  isLoading,
  error,
  selectedCategory,
  onSearchPress,
  onCategorySelect,
  onSeeAllCategories,
  onViewAllDeals,
  onSelectProduct,
  onRetry,
}: HomePresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader
          rightActions={[
            {
              accessibilityLabel: "Notifications",
              icon: "notifications-outline",
            },
          ]}
          title="ShopKart"
        />

        <SearchBar
          accessibilityLabel="Search products"
          onPress={onSearchPress}
          placeholder="Search for products, brands and more"
          style={styles.searchBar}
        />

        <View style={styles.promoBanner}>
          <View style={styles.promoCopy}>
            <Text style={styles.promoTitle}>
              Shop Smarter.{"\n"}Shop Better.
            </Text>
            <Text style={styles.promoDescription}>
              Discover great products at unbeatable prices.
            </Text>
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopButtonText}>Shop Now</Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          </View>
          <Image
            accessibilityLabel="Shopping bags and a phone with the ShopKart app"
            contentFit="contain"
            source={require("@/assets/images/login_illustration.png")}
            style={styles.promoImage}
          />
        </View>

        {isLoading ? (
          <View
            accessibilityLiveRegion="polite"
            style={styles.catalogLoading}
          >
            <ActivityIndicator color={theme.colors.primary} size="large" />
            <Text style={styles.catalogStatusText}>
              Loading categories and best deals...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.catalogError}>
            <Text style={styles.catalogStatusText}>{error}</Text>
            <CustomButton onPress={onRetry} title="Try again" />
          </View>
        ) : (
          <>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Top Categories</Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={onSeeAllCategories}
                style={styles.seeAll}
              >
                <Text style={styles.seeAllText}>See all</Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const isSelected = selectedCategory === category.name;
                return (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={category.id}
                    onPress={() => onCategorySelect(category.name)}
                    style={styles.categoryItem}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        isSelected && styles.categoryIconSelected,
                      ]}
                    >
                      <CategoryArtwork
                        iconUrl={category.icon}
                        fallbackIcon={
                          categoryIcons[category.slug] ?? "grid-outline"
                        }
                        selected={isSelected}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryName,
                        isSelected && styles.categoryNameSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Best Deals</Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={onViewAllDeals}
                style={styles.seeAll}
              >
                <Text style={styles.seeAllText}>View all</Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              accessibilityLabel="Best deals, horizontally scrollable"
              alwaysBounceHorizontal
              decelerationRate="fast"
              data={featuredProducts}
              keyExtractor={(product) => String(product.id)}
              horizontal
              contentContainerStyle={styles.dealList}
              nestedScrollEnabled
              persistentScrollbar
              showsHorizontalScrollIndicator
              style={styles.dealScroll}
              renderItem={({ item: product }) => {
                const imageUrl = product.variants[0]?.images[0];
                return (
                  <TouchableOpacity
                    onPress={() => onSelectProduct(product.id)}
                    style={styles.dealCard}
                  >
                    <View style={styles.productArt}>
                      {imageUrl ? (
                        <Image
                          accessibilityLabel={`${product.name} product image`}
                          contentFit="cover"
                          source={{ uri: imageUrl }}
                          style={StyleSheet.absoluteFill}
                        />
                      ) : (
                        <Ionicons
                          name="image-outline"
                          size={34}
                          color={theme.colors.primaryDark}
                        />
                      )}
                    </View>
                    <Text numberOfLines={1} style={styles.productName}>
                      {product.name}
                    </Text>
                    <Text style={styles.dealBadge}>{product.badge}</Text>
                    <View style={styles.productMeta}>
                      <Text style={styles.productPrice}>
                        {currency(product.deal.price)}
                      </Text>
                      <View style={styles.rating}>
                        <Ionicons
                          name="star"
                          size={12}
                          color={theme.colors.warning}
                        />
                        <Text style={styles.ratingText}>
                          {product.rating.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}
      </ScrollView>
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
    promoBanner: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.md,
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.lg,
      minHeight: 150,
      overflow: "hidden",
      padding: theme.spacing.lg,
    },
    promoCopy: { flex: 1, gap: theme.spacing.xs, maxWidth: "58%", zIndex: 1 },
    promoTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.h3,
      fontWeight: theme.typography.weight.bold,
      lineHeight: 26,
    },
    promoDescription: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
      lineHeight: theme.typography.lineHeight.bodySmall,
    },
    shopButton: {
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.xs,
      flexDirection: "row",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
      minHeight: 32,
      paddingHorizontal: theme.spacing.sm,
    },
    shopButtonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.semiBold,
    },
    promoImage: {
      height: "120%",
      position: "absolute",
      right: -theme.spacing.xs,
      bottom: -theme.spacing.xs,
      width: "58%",
    },
    catalogLoading: {
      alignItems: "center",
      gap: theme.spacing.sm,
      justifyContent: "center",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.xl,
      minHeight: 180,
    },
    catalogError: {
      alignItems: "center",
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    catalogStatusText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
    },
    sectionHeading: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.semiBold,
      lineHeight: 22,
    },
    seeAll: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
    },
    seeAllText: {
      color: theme.colors.primary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.medium,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: theme.spacing.xs,
    },
    categoryItem: {
      alignItems: "center",
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      width: "25%",
    },
    categoryIcon: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      height: 58,
      justifyContent: "center",
      width: "100%",
    },
    categoryIconSelected: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primaryLight,
    },
    categoryName: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
      marginTop: theme.spacing.xs,
    },
    categoryNameSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.weight.semiBold,
    },
    dealList: { gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
    dealScroll: {
      flexGrow: 0,
      flexShrink: 0,
      width: "100%",
    },
    dealCard: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      padding: theme.spacing.sm,
      width: 156,
    },
    productArt: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: theme.radius.sm,
      height: 103,
      justifyContent: "center",
      overflow: "hidden",
    },
    dealBadge: {
      alignSelf: "flex-start",
      color: theme.colors.primary,
      fontSize: theme.typography.tiny,
      fontWeight: theme.typography.weight.semiBold,
      marginTop: theme.spacing.xs,
    },
    productName: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
      marginTop: theme.spacing.sm,
    },
    productMeta: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.xs,
    },
    productPrice: {
      color: theme.colors.price,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.bold,
    },
    rating: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs / 2,
    },
    ratingText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.tiny,
    },
  });
