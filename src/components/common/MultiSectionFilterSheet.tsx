import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Host, Slider } from "@expo/ui";
import { useMemo, useRef } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "@/components/common/CustomButton";
import { useAppTheme } from "@/utils/useTheme";

export interface FilterSection {
  id: string;
  title: string;
  options: string[];
  selectedValue: string;
  unselectedLabel: string;
}

type FilterListItem =
  | {
      key: string;
      type: "section";
      title: string;
    }
  | {
      key: string;
      type: "option";
      sectionId: string;
      label: string;
      value: string;
      selected: boolean;
    };

interface MultiSectionFilterSheetProps {
  visible: boolean;
  title: string;
  sections: FilterSection[];
  minPrice: number;
  maxPrice: number;
  maxPriceLimit: number;
  rating: number;
  onClose: () => void;
  onSelect: (sectionId: string, value: string) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onRatingChange: (value: number) => void;
  onClear: () => void;
  onApply: () => void;
}

export default function MultiSectionFilterSheet({
  visible,
  title,
  sections,
  minPrice,
  maxPrice,
  maxPriceLimit,
  rating,
  onClose,
  onSelect,
  onMinPriceChange,
  onMaxPriceChange,
  onRatingChange,
  onClear,
  onApply,
}: MultiSectionFilterSheetProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const closeButtonRef = useRef<View>(null);
  const filterItems = useMemo(() => {
    const items: FilterListItem[] = [];

    for (const section of sections) {
      items.push({
        key: `section:${section.id}`,
        type: "section",
        title: section.title,
      });
      items.push({
        key: `option:${section.id}:all`,
        type: "option",
        sectionId: section.id,
        label: section.unselectedLabel,
        value: "",
        selected: !section.selectedValue,
      });
      section.options.forEach((option, index) => {
        items.push({
          key: `option:${section.id}:${index}:${option}`,
          type: "option",
          sectionId: section.id,
          label: option,
          value: option,
          selected: section.selectedValue === option,
        });
      });
    }

    return items;
  }, [sections]);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      onShow={() => closeButtonRef.current?.focus()}
      transparent
      visible={visible}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable
              accessibilityLabel="Close filters"
              onPress={onClose}
              hitSlop={10}
              ref={closeButtonRef}
            >
              <Ionicons
                name="close"
                size={22}
                color={theme.colors.textPrimary}
              />
            </Pressable>
          </View>
          <FlatList
            contentContainerStyle={styles.filterContent}
            data={filterItems}
            keyExtractor={(item) => item.key}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) =>
              item.type === "section" ? (
                <Text style={styles.filterSectionTitle}>{item.title}</Text>
              ) : (
                <FilterOption
                  label={item.label}
                  selected={item.selected}
                  onPress={() => onSelect(item.sectionId, item.value)}
                  checkmarkColor={theme.colors.onPrimary}
                  styles={styles}
                />
              )
            }
            ListFooterComponent={
              <View style={styles.numericFilters}>
                <Text style={styles.filterSectionTitle}>Price range</Text>
                <Text style={styles.sliderBounds}>
                  {formatPrice(0)} - {formatPrice(maxPriceLimit)}
                </Text>
                <View style={styles.sliderControl}>
                  <View style={styles.sliderLabels}>
                    <Text style={styles.optionText}>Minimum price</Text>
                    <Text style={styles.sliderValue}>
                      {formatPrice(minPrice)}
                    </Text>
                  </View>
                  <Host
                    matchContents={{ vertical: true }}
                    style={styles.sliderHost}
                  >
                    <Slider
                      min={0}
                      max={maxPriceLimit}
                      step={1000}
                      value={minPrice}
                      onValueChange={onMinPriceChange}
                    />
                  </Host>
                </View>
                <View style={styles.sliderControl}>
                  <View style={styles.sliderLabels}>
                    <Text style={styles.optionText}>Maximum price</Text>
                    <Text style={styles.sliderValue}>
                      {formatPrice(maxPrice)}
                    </Text>
                  </View>
                  <Host
                    matchContents={{ vertical: true }}
                    style={styles.sliderHost}
                  >
                    <Slider
                      min={minPrice}
                      max={maxPriceLimit}
                      step={1000}
                      value={Math.max(maxPrice, minPrice)}
                      onValueChange={onMaxPriceChange}
                    />
                  </Host>
                </View>
                <View style={styles.ratingFilters}>
                  <Text style={styles.filterSectionTitle}>
                    Minimum rating
                  </Text>
                  <View style={styles.ratingChoices}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: rating === 0 }}
                      onPress={() => onRatingChange(0)}
                      style={[
                        styles.ratingAnyButton,
                        rating === 0 && styles.ratingAnyButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.ratingAnyText,
                          rating === 0 && styles.ratingAnyTextSelected,
                        ]}
                      >
                        Any
                      </Text>
                    </Pressable>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Pressable
                        key={value}
                        accessibilityLabel={`${value} stars and up`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: rating === value }}
                        onPress={() => onRatingChange(value)}
                        style={styles.starButton}
                      >
                        <Ionicons
                          color={
                            value <= rating
                              ? theme.colors.warning
                              : theme.colors.textTertiary
                          }
                          name={value <= rating ? "star" : "star-outline"}
                          size={22}
                        />
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            }
            style={styles.filterList}
          />
          <View style={styles.sheetActions}>
            <Pressable
              accessibilityRole="button"
              onPress={onClear}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear all</Text>
            </Pressable>
            <CustomButton
              onPress={onApply}
              style={styles.applyButton}
              title="Apply filters"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const formatPrice = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

function FilterOption({
  label,
  selected,
  onPress,
  checkmarkColor,
  styles,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  checkmarkColor: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.checkboxRow}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && (
          <Ionicons name="checkmark" size={14} color={checkmarkColor} />
        )}
      </View>
      <Text style={styles.optionText}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    modalOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      flex: 1,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      maxHeight: "88%",
      paddingBottom: theme.spacing.lg,
    },
    sheetHeader: {
      alignItems: "center",
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
    },
    sheetTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.semiBold,
    },
    filterContent: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    filterList: { flexShrink: 1 },
    filterSectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
      marginTop: theme.spacing.xs,
    },
    optionList: { gap: theme.spacing.xs },
    numericFilters: {
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.md,
    },
    sliderControl: {
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    sliderLabels: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    sliderValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.semiBold,
    },
    sliderBounds: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.caption,
      marginTop: -theme.spacing.xs,
    },
    sliderHost: {
      width: "100%",
    },
    ratingFilters: {
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    ratingChoices: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    ratingAnyButton: {
      borderColor: theme.colors.border,
      borderRadius: theme.radius.round,
      borderWidth: 1,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    ratingAnyButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    ratingAnyText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.caption,
      fontWeight: theme.typography.weight.medium,
    },
    ratingAnyTextSelected: {
      color: theme.colors.onPrimary,
    },
    starButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 40,
      minWidth: 28,
    },
    checkboxRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
      minHeight: 36,
    },
    checkbox: {
      alignItems: "center",
      borderColor: theme.colors.textTertiary,
      borderRadius: theme.radius.xs,
      borderWidth: 1,
      height: 20,
      justifyContent: "center",
      width: 20,
    },
    checkboxSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
    },
    sheetActions: {
      alignItems: "center",
      borderTopColor: theme.colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    clearButton: {
      alignItems: "center",
      borderColor: theme.colors.border,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 46,
      paddingHorizontal: theme.spacing.lg,
    },
    clearButtonText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.semiBold,
    },
    applyButton: { flex: 1 },
  });
