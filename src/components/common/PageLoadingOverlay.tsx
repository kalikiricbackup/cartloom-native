import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAppTheme } from "@/utils/useTheme";

interface PageLoadingOverlayProps {
  visible: boolean;
}

export default function PageLoadingOverlay({
  visible,
}: PageLoadingOverlayProps) {
  const theme = useAppTheme();

  if (!visible) return null;

  return (
    <View
      accessibilityLabel="Loading cart"
      accessibilityRole="progressbar"
      style={styles.overlay}
    >
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
    elevation: 10,
  },
});
