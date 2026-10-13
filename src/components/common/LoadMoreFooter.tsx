import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomButton from "@/components/common/CustomButton";
import { useAppTheme } from "@/utils/useTheme";

interface LoadMoreFooterProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function LoadMoreFooter({
  loading,
  error,
  onRetry,
}: LoadMoreFooterProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  if (!loading && !error) return null;

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <Text style={styles.message}>Loading more products...</Text>
        </>
      ) : (
        <>
          <Text style={styles.message}>{error}</Text>
          <CustomButton onPress={onRetry} title="Retry loading more" />
        </>
      )}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
    },
    message: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.bodySmall,
      textAlign: "center",
    },
  });
