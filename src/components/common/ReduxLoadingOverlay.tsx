import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import { useAppTheme } from "@/utils/useTheme";

export default function ReduxLoadingOverlay() {
  const { isLoading, loadingMessage } = useSelector(
    (state: RootState) => state.user,
  );
  const theme = useAppTheme();

  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      {loadingMessage ? (
        <Text style={[styles.message, { color: theme.colors.textPrimary }]}>
          {loadingMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.25)",
    bottom: 0,
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
  },
});
