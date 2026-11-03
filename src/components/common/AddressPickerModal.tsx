import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { Address } from "@/types/api/address";
import { useAppTheme } from "@/utils/useTheme";
import CustomButton from "./CustomButton";

interface AddressPickerModalProps {
  addresses: Address[];
  visible: boolean;
  isLoading: boolean;
  isSubmitting?: boolean;
  onSelectAddress: (address: Address) => void;
  onClose: () => void;
  onAddAddress: () => void;
}

export default function AddressPickerModal({
  addresses,
  visible,
  isLoading,
  isSubmitting = false,
  onSelectAddress,
  onClose,
  onAddAddress,
}: AddressPickerModalProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Choose a delivery address</Text>
          {isLoading ? (
            <Text style={styles.hint}>Loading your addresses…</Text>
          ) : addresses.length === 0 ? (
            <Text style={styles.hint}>Add an address to place your order.</Text>
          ) : (
            <FlatList
              data={addresses}
              keyExtractor={(address) => String(address.id)}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const addressLines = Array.from(
                  new Set(
                    [item.address, item.street, item.city, item.state].filter(
                      Boolean,
                    ),
                  ),
                ).join(", ");
                const details = [addressLines, item.pin].filter(Boolean).join(" • ");

                return (
                  <Pressable
                    accessibilityRole="button"
                    disabled={isSubmitting}
                    onPress={() => onSelectAddress(item)}
                    style={styles.address}
                  >
                    <Text style={styles.addressLabel}>{item.label || "Address"}</Text>
                    <Text style={styles.hint}>{details}</Text>
                  </Pressable>
                );
              }}
            />
          )}
          {!isLoading && addresses.length === 0 ? (
            <CustomButton onPress={onAddAddress} title="Add Address" />
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.cancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      flex: 1,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      gap: theme.spacing.md,
      maxHeight: "75%",
      padding: theme.spacing.lg,
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.semiBold,
    },
    hint: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body,
    },
    address: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },
    addressLabel: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.semiBold,
    },
    separator: {
      height: theme.spacing.sm,
    },
    cancel: {
      alignItems: "center",
      padding: theme.spacing.sm,
    },
    cancelText: {
      color: theme.colors.primary,
      fontSize: theme.typography.body,
      fontWeight: theme.typography.weight.semiBold,
    },
  });
