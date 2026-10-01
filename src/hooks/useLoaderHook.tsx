import { useAppTheme } from "@/utils/useTheme";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

/**
 * Custom hook to manage loading state and display a loader component.
 * @function useLoaderHook
 * @returns  {[() => React.JSX.Element | null, () => void, () => void]} - An array containing:
 * - LoaderComponent: A function that returns the loader component (or null if not loading).
 * - showLoading: A function to set the loading state to true.
 * - hideLoading: A function to set the loading state to false.
 */
export const useLoaderHook = () => {
  const [loading, setLoading] = useState(false);
  const { colors } = useAppTheme();

  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };

  /**
   * Returns the LoaderComponent, which displays an ActivityIndicator when loading is true.
   * @function LoaderComponent
   * @returns {React.JSX.Element | null} The loader component or null.
   */
  const LoaderComponent = () =>
    loading && (
      <View style={styles.loaderView}>
        <ActivityIndicator color={colors.primary} size={"large"} />
      </View>
    );

  return [LoaderComponent, showLoading, hideLoading];
};

const styles = StyleSheet.create({
  loaderView: {
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    position: "absolute",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
