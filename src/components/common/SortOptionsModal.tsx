import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useRef } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "@/utils/useTheme";

export interface SortOption<Value extends string> {
  value: Value;
  label: string;
}

interface SortOptionsModalProps<Value extends string> {
  visible: boolean;
  title?: string;
  options: SortOption<Value>[];
  selectedValue: Value;
  onClose: () => void;
  onSelect: (value: Value) => void;
}

export default function SortOptionsModal<Value extends string>({
  visible,
  title = "Sort by",
  options,
  selectedValue,
  onClose,
  onSelect,
}: SortOptionsModalProps<Value>) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const firstOptionRef = useRef<View>(null);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => firstOptionRef.current?.focus()}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close sort options"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          {options.map((option, index) => {
            const selected = option.value === selectedValue;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                key={option.value}
                onPress={() => onSelect(option.value)}
                ref={index === 0 ? firstOptionRef : undefined}
                style={styles.option}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {selected && (
                  <Ionicons
                    name="checkmark"
                    size={19}
                    color={theme.colors.primary}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    overlay: {
      alignItems: "stretch",
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      flex: 1,
      justifyContent: "center",
    },
    dialog: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      marginHorizontal: theme.spacing.xl,
      padding: theme.spacing.lg,
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.semiBold,
    },
    option: {
      alignItems: "center",
      borderBottomColor: theme.colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 48,
    },
    optionLabel: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.bodySmall,
    },
  });
