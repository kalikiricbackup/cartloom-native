import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { Address } from "@/types/api/address";
import { useAppTheme } from "@/utils/useTheme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface AddressesListItemProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
}

const AddressesListItem = ({
  address,
  onEdit,
  onDelete,
}: AddressesListItemProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const addressLine = Array.from(
    new Set(
      [address.address, address.street, address.city, address.state].filter(
        Boolean,
      ),
    ),
  ).join(", ");

  return (
    <View style={styles.card}>
      <View style={styles.locationIcon}>
        <Ionicons color={theme.colors.primary} name="location" size={22} />
      </View>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.label}>{address.label}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => onEdit?.(address)}
              style={styles.action}
            >
              <Text style={styles.actionText}>Edit</Text>
            </Pressable>
            <Text style={styles.actionDivider}>|</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => onDelete?.(address)}
              style={styles.action}
            >
              <Text style={styles.actionText}>Delete</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.address} numberOfLines={2}>
          {[addressLine, address.pin].filter(Boolean).join(" • ")}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    card: {
      alignItems: "flex-start",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      flexDirection: "row",
      gap: theme.spacing.md,
      padding: theme.spacing.md,
    },
    locationIcon: {
      alignItems: "center",
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radius.round,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    content: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    heading: {
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing.xs,
      justifyContent: "space-between",
    },
    label: {
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
    actions: {
      alignItems: "center",
      flexDirection: "row",
    },
    action: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
    },
    actionText: {
      color: theme.colors.primary,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
    },
    actionDivider: {
      color: theme.colors.textTertiary,
      fontSize: theme.typography.bodySmall,
    },
    address: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
      lineHeight: theme.typography.lineHeight.bodySmall,
    },
  });

export default AddressesListItem;
