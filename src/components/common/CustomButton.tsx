import { useAppTheme } from "@/utils/useTheme";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface CustomButtonProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  style,
  disabled = false,
  loading = false,
}: CustomButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      {loading && (
        <ActivityIndicator
          color={theme.colors.onPrimary}
          size="small"
          style={styles.loader}
        />
      )}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      flexDirection: "row",
      justifyContent: "center",
      minHeight: 48,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
    },
    disabled: {
      opacity: 0.55,
    },
    loader: {
      marginRight: theme.spacing.sm,
    },
    text: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.bodyLarge,
      fontWeight: theme.typography.weight.semiBold,
    },
  });
