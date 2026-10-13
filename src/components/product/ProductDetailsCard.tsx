import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type {
  ProductDetails,
  ProductDetailsVariant,
} from "@/types/api/productDetails";
import { useAppTheme } from "@/utils/useTheme";

interface ProductDetailsCardProps {
  product: ProductDetails;
  selectedVariant: ProductDetailsVariant;
  onOptionSelect: (type: string, value: string) => void;
}

const currency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

const swatchColors: Record<string, string> = {
  amber: "#F2C14E",
  black: "#222222",
  blue: "#2874F0",
  cobalt: "#5553A6",
  gray: "#87909A",
  green: "#4F8A68",
  lilac: "#B9A0D3",
  midnight: "#343A4A",
  natural: "#B9AA98",
  navy: "#23395B",
  obsidian: "#272A2C",
  pink: "#E6A7B7",
  porcelain: "#F0EDE7",
  purple: "#8E72B8",
  silver: "#C7CBD1",
  starlight: "#E5DCCB",
  titanium: "#9A968F",
  violet: "#7767A8",
  white: "#FFFFFF",
  wintergreen: "#A8C9B4",
  yellow: "#F2D84A",
};

const getSwatchColor = (value: string) => {
  const normalizedValue = value.toLocaleLowerCase();
  const match = Object.entries(swatchColors).find(([name]) =>
    normalizedValue.includes(name),
  );
  return match?.[1] ?? "#AEB7C2";
};

export default function ProductDetailsCard({
  product,
  selectedVariant,
  onOptionSelect,
}: ProductDetailsCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const discount =
    selectedVariant.originalPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.originalPrice - selectedVariant.price) /
            selectedVariant.originalPrice) *
            100,
        )
      : 0;
  const optionGroups = useMemo(() => {
    const groups = new Map<string, { label: string; values: string[] }>();

    product.variants.forEach((variant) => {
      variant.options.forEach((option) => {
        const group = groups.get(option.type) ?? {
          label: option.label,
          values: [],
        };
        if (!group.values.includes(option.value)) {
          group.values.push(option.value);
        }
        groups.set(option.type, group);
      });
    });

    return [...groups.entries()].map(([type, group]) => ({ type, ...group }));
  }, [product.variants]);

  return (
    <>
      <View style={styles.productInfo}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingValue}>{product.rating.toFixed(1)}</Text>
            <Ionicons
              color={theme.colors.onPrimary}
              name="star"
              size={12}
            />
          </View>
          <Text style={styles.reviewCount}>
            {product.reviews} ratings and reviews
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>
            {currency(selectedVariant.price)}
          </Text>
          {discount > 0 ? (
            <>
              <Text style={styles.originalPrice}>
                {currency(selectedVariant.originalPrice)}
              </Text>
              <Text style={styles.discount}>{discount}% off</Text>
            </>
          ) : null}
        </View>
        <Text style={styles.taxNote}>Inclusive of all taxes</Text>
        <Text
          style={[
            styles.stockMessage,
            selectedVariant.stock <= 0 && styles.outOfStock,
          ]}
        >
          {selectedVariant.stock > 0
            ? `${selectedVariant.stock} left in stock`
            : "Currently out of stock"}
        </Text>
      </View>

      {optionGroups.map((group) => {
        const selectedValue = selectedVariant.options.find(
          (option) => option.type === group.type,
        )?.value;
        const isColorGroup = group.type.toLocaleLowerCase() === "color";

        return (
          <View key={group.type} style={styles.optionSection}>
            <Text style={styles.sectionTitle}>
              {group.label}
              {selectedValue ? (
                <Text style={styles.selectedOption}>: {selectedValue}</Text>
              ) : null}
            </Text>
            <View style={styles.optionList}>
              {group.values.map((value) => {
                const isSelected = value === selectedValue;
                return (
                  <Pressable
                    accessibilityLabel={`${group.label} ${value}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={value}
                    onPress={() => onOptionSelect(group.type, value)}
                    style={[
                      styles.optionChip,
                      isSelected && styles.selectedChip,
                    ]}
                  >
                    {isColorGroup ? (
                      <View
                        style={[
                          styles.colorSwatch,
                          { backgroundColor: getSwatchColor(value) },
                          isSelected && styles.selectedSwatch,
                        ]}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}

      {product.offers.length > 0 ? (
        <View style={styles.offerSection}>
          <Text style={styles.sectionTitle}>Available offers</Text>
          {product.offers.map((offer) => (
            <View key={offer} style={styles.offerRow}>
              <Ionicons
                color={theme.colors.success}
                name="pricetag-outline"
                size={17}
              />
              <Text style={styles.offerText}>{offer}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>About this product</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    productInfo: {
      backgroundColor: theme.colors.card,
      marginTop: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    brand: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
      marginBottom: theme.spacing.xs,
    },
    productName: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.h4,
      fontWeight: theme.typography.weight.semiBold,
    },
    ratingRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    ratingBadge: {
      alignItems: "center",
      backgroundColor: theme.colors.success,
      borderRadius: theme.radius.sm,
      flexDirection: "row",
      gap: 3,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 3,
    },
    ratingValue: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.bold,
    },
    reviewCount: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
    },
    priceRow: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    currentPrice: {
      color: theme.colors.price,
      fontSize: theme.typography.h3,
      fontWeight: theme.typography.weight.bold,
    },
    originalPrice: {
      color: theme.colors.textTertiary,
      fontSize: theme.typography.body,
      textDecorationLine: "line-through",
    },
    discount: {
      color: theme.colors.discount,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
    taxNote: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
      marginTop: theme.spacing.xs,
    },
    stockMessage: {
      color: theme.colors.success,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
      marginTop: theme.spacing.sm,
    },
    outOfStock: { color: theme.colors.error },
    optionSection: {
      backgroundColor: theme.colors.card,
      marginTop: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    sectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.semiBold,
      marginBottom: theme.spacing.md,
    },
    selectedOption: {
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weight.regular,
    },
    optionList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    optionChip: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      flexDirection: "row",
      gap: theme.spacing.sm,
      minHeight: 42,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    selectedChip: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    colorSwatch: {
      borderColor: theme.colors.border,
      borderRadius: 20,
      borderWidth: 1,
      height: 18,
      width: 18,
    },
    selectedSwatch: {
      borderColor: theme.colors.primaryDark,
      borderWidth: 2,
    },
    optionText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
    },
    selectedOptionText: {
      color: theme.colors.primaryDark,
      fontWeight: theme.typography.weight.semiBold,
    },
    offerSection: {
      backgroundColor: theme.colors.card,
      marginTop: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    offerRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    offerText: {
      color: theme.colors.textSecondary,
      flex: 1,
      fontSize: theme.typography.bodySmall,
      lineHeight: 20,
    },
    descriptionSection: {
      backgroundColor: theme.colors.card,
      marginTop: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    description: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body,
      lineHeight: 22,
    },
  });
