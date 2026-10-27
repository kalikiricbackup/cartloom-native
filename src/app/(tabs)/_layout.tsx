// app/(tabs)/_layout.tsx

import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";

import { useAppTheme } from "@/utils/useTheme";

export default function TabsLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: theme.colors.tabActive,

        tabBarInactiveTintColor: theme.colors.tabInactive,

        tabBarStyle: {
          backgroundColor: theme.colors.card,

          borderTopColor: theme.colors.border,

          borderTopWidth: 1,

          height: 76,

          paddingTop: 4,
          paddingBottom: 12,
        },

        tabBarLabelStyle: {
          fontSize: 11,

          lineHeight: 14,

          fontWeight: theme.typography.weight.medium,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          href: "/(tabs)/cart",
          tabBarButtonTestID: "cart-tab",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="wishList"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen name="(browse)" options={{ href: null }} />
      <Tabs.Screen name="(account)" options={{ href: null }} />
    </Tabs>
  );
}
