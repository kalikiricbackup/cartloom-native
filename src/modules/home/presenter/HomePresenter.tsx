import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/utils/useTheme";

interface HomePresenterProps {
  query: string;
  selectedCategory: string;
  onQueryChange: (query: string) => void;
  onClearQuery: () => void;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { name: "Mobiles", icon: "phone-portrait-outline" as const },
  { name: "Fashion", icon: "shirt-outline" as const },
  { name: "Electronics", icon: "laptop-outline" as const },
  { name: "Home", icon: "home-outline" as const },
  { name: "Beauty", icon: "color-palette-outline" as const },
  { name: "Appliances", icon: "cube-outline" as const },
  { name: "Sports", icon: "football-outline" as const },
  { name: "More", icon: "apps-outline" as const },
];

const deals = [
  { name: "iPhone 15", price: "₹54,999", rating: "4.6" },
  { name: "Samsung Galaxy S24", price: "₹74,999", rating: "4.5" },
];

export default function HomePresenter({
  query,
  selectedCategory,
  onQueryChange,
  onClearQuery,
  onCategorySelect,
}: HomePresenterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Ionicons
                name="bag-handle"
                size={19}
                color={theme.colors.primaryDark}
              />
            </View>
            <Text style={styles.brandName}>ShopKart</Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Notifications"
            style={styles.iconButton}
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color={theme.colors.onPrimary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.textTertiary}
          />
          <TextInput
            accessibilityLabel="Search products"
            onChangeText={onQueryChange}
            placeholder="Search for products, brands and more"
            placeholderTextColor={theme.colors.textTertiary}
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />
          {query.length > 0 && (
            <TouchableOpacity
              accessibilityLabel="Clear search"
              onPress={onClearQuery}
            >
              <Ionicons
                name="close-circle"
                size={19}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>

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

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <TouchableOpacity style={styles.seeAll}>
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
                key={category.name}
                onPress={() => onCategorySelect(category.name)}
                style={styles.categoryItem}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    isSelected && styles.categoryIconSelected,
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={23}
                    color={
                      isSelected
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
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
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>View all</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.dealList}
          showsHorizontalScrollIndicator={false}
        >
          {deals.map((deal) => (
            <TouchableOpacity key={deal.name} style={styles.dealCard}>
              <View style={styles.productArt}>
                <View style={styles.phoneFrame}>
                  <View style={styles.phoneScreen}>
                    <Ionicons
                      name="phone-portrait"
                      size={34}
                      color={theme.colors.primary}
                    />
                  </View>
                </View>
              </View>
              <Text numberOfLines={1} style={styles.productName}>
                {deal.name}
              </Text>
              <View style={styles.productMeta}>
                <Text style={styles.productPrice}>{deal.price}</Text>
                <View style={styles.rating}>
                  <Ionicons
                    name="star"
                    size={12}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.ratingText}>{deal.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    content: { paddingBottom: theme.spacing.lg },
    topBar: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryDark,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      paddingTop: theme.spacing.xs,
    },
    brand: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    brandMark: {
      alignItems: "center",
      backgroundColor: theme.colors.warning,
      borderRadius: theme.radius.xs,
      height: 31,
      justifyContent: "center",
      width: 27,
    },
    brandName: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.display,
      fontWeight: theme.typography.weight.semiBold,
    },
    iconButton: {
      alignItems: "center",
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    searchBar: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.sm,
      minHeight: 46,
      paddingHorizontal: theme.spacing.md,
    },
    searchInput: {
      backgroundColor: "transparent",
      borderWidth: 0,
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.bodySmall,
      outlineWidth: 0,
      paddingVertical: theme.spacing.sm,
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
    },
    phoneFrame: {
      backgroundColor: theme.colors.textPrimary,
      borderRadius: theme.radius.sm,
      height: 82,
      padding: 4,
      width: 49,
    },
    phoneScreen: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.xs,
      flex: 1,
      justifyContent: "center",
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
