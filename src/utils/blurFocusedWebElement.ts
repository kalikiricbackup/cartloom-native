import { Platform } from "react-native";

export const blurFocusedWebElement = () => {
  if (
    Platform.OS === "web" &&
    typeof document !== "undefined" &&
    typeof HTMLElement !== "undefined" &&
    document.activeElement instanceof HTMLElement
  ) {
    document.activeElement.blur();
  }
};
