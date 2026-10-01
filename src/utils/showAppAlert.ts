import type { AlertButton } from "react-native";
import { Alert, Platform } from "react-native";

export const showAppAlert = (
  title: string,
  message: string,
  buttons?: AlertButton[],
) => {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = `${title}\n\n${message}`;
  if (buttons && buttons.length > 1) {
    const confirmed = globalThis.confirm(text);
    const selectedButton = confirmed ? buttons[0] : buttons[1];
    selectedButton?.onPress?.();
    return;
  }

  globalThis.alert(text);
  buttons?.[0]?.onPress?.();
};
