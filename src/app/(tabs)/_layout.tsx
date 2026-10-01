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

          height: 60,

          paddingTop: 6,
          paddingBottom: 6,
        },

        tabBarLabelStyle: {
          fontSize: theme.typography.caption,

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
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
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
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
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
    </Tabs>
  );
}
