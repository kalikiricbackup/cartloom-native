import { useAppTheme } from "@/utils/useTheme";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const theme = useAppTheme();

  return (
    <Stack
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="otp" />
      <Stack.Screen name="login" />
      <Stack.Screen name="registration" />
    </Stack>
  );
}
