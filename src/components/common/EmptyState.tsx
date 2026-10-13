import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "@/components/common/CustomButton";
import { useAppTheme } from "@/utils/useTheme";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: IconName;
  loading?: boolean;
  fillAvailableSpace?: boolean;
  retryLabel?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  icon,
  loading = false,
  fillAvailableSpace = false,
  retryLabel = "Try again",
  onRetry,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View
      accessibilityLiveRegion={loading ? "polite" : "none"}
      style={[styles.container, fillAvailableSpace && styles.fillAvailableSpace]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} size="large" />
      ) : icon ? (
        <Ionicons
          color={theme.colors.textTertiary}
          name={icon}
          size={40}
        />
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? <CustomButton onPress={onRetry} title={retryLabel} /> : null}
      {actionLabel && onAction ? (
        <CustomButton onPress={onAction} title={actionLabel} />
      ) : null}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxxxl,
    },
    fillAvailableSpace: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.title,
      fontWeight: theme.typography.weight.semiBold,
      textAlign: "center",
    },
    message: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
      textAlign: "center",
    },
  });
