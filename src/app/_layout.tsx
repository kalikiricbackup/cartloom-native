import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { userActions, type AuthSession } from "@/features/userSlice";
import { setAuthToken } from "@/services/ApiClient";
import { store } from "@/store/store";
import {
  getStorageItem,
  removeStorageItem,
  StorageKeys,
} from "@/utils/storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [sessionRestored, setSessionRestored] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Ionicons: require("@react-native-vector-icons/ionicons/fonts/Ionicons.ttf"),
  });

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const session = await getStorageItem<AuthSession>(
          StorageKeys.authSession,
        );
        const validSession =
          session !== null &&
          typeof session === "object" &&
          typeof session.email === "string" &&
          typeof session.accessToken === "string" &&
          typeof session.refreshToken === "string" &&
          typeof session.tokenType === "string" &&
          typeof session.profileCompleted === "boolean";

        if (validSession && !cancelled) {
          setAuthToken(session.accessToken);
          store.dispatch(userActions.setCredentials(session));
        } else if (session !== null && !validSession) {
          await removeStorageItem(StorageKeys.authSession);
        }
      } catch (error) {
        console.error("Unable to restore saved session.", error);
      } finally {
        if (!cancelled) setSessionRestored(true);
      }
    };

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  if ((!fontsLoaded && !fontError) || !sessionRestored) return null;

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LoadingProvider>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </LoadingProvider>
      </ThemeProvider>
    </Provider>
  );
}
